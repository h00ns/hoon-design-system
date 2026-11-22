import * as React from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { useFieldContext, useFieldControl } from '../field/field-context';
import { composeRefs } from '../input/compose-refs';
import { cx } from '../utils/cx';

export type ComboboxSize = 'sm' | 'md' | 'lg';

export interface ComboboxOption {
  /** 폼으로 제출되고 `onValueChange` 로 전달되는 값 */
  value: string;
  /** 목록과 입력창에 보이는 텍스트. 기본 필터도 이 텍스트로 찾는다. */
  label: string;
  /** 선택할 수 없는 항목. 목록에는 보이지만 키보드 이동에서 건너뛴다. */
  disabled?: boolean;
  /** 레이블에 없는 검색어로도 찾게 할 때 (예: 영문 이름, 별칭) */
  keywords?: string[];
}

export interface ComboboxRenderOptionState {
  selected: boolean;
  highlighted: boolean;
}

export interface ComboboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'role' | 'children'
> {
  /** 고를 수 있는 항목 */
  options: ComboboxOption[];
  /** 선택된 값 (제어 모드). 선택이 없으면 `null`. */
  value?: string | null;
  /** 처음 선택된 값 (비제어 모드) */
  defaultValue?: string | null;
  /** 선택이 바뀔 때. 지우면 `null` 이 전달된다. */
  onValueChange?: (value: string | null) => void;
  /** 입력창의 텍스트 (제어 모드) */
  inputValue?: string;
  /** 처음 입력창 텍스트 (비제어 모드). 기본은 선택된 항목의 레이블. */
  defaultInputValue?: string;
  /** 입력창 텍스트가 바뀔 때 */
  onInputValueChange?: (inputValue: string) => void;
  /** 목록 열림 (제어 모드) */
  open?: boolean;
  /** 목록이 열리고 닫힐 때 */
  onOpenChange?: (open: boolean) => void;
  /**
   * 검색어로 항목을 거른다. 기본은 레이블·keywords 에 검색어가 포함되는지 (대소문자 무시).
   * 서버에서 거른 결과를 `options` 로 넘길 때는 `() => true` 를 준다.
   */
  filter?: (option: ComboboxOption, query: string) => boolean;
  /** 크기. Input·Select 와 같은 높이. @default 'md' */
  size?: ComboboxSize;
  /** 오류 상태. Field 안에서는 `Field.Root invalid` 로 자동 연결된다. */
  invalid?: boolean;
  /** 결과가 없을 때 보여주고 읽어주는 문구. @default '결과가 없습니다' */
  emptyText?: string;
  /** 지우기 버튼의 접근 가능한 이름. @default '지우기' */
  clearLabel?: string;
  /** 지우기 버튼을 보여준다. @default true */
  clearable?: boolean;
  /** 결과 개수를 스크린리더에 알리는 문구. 기본은 `${n}개 결과` */
  formatResultCount?: (count: number) => string;
  /** 항목 내용을 직접 그린다. 접근 가능한 이름이 되므로 `label` 텍스트를 포함하는 것이 좋다. */
  renderOption?: (option: ComboboxOption, state: ComboboxRenderOptionState) => React.ReactNode;
  /** 포털 대상. 기본은 document.body */
  container?: HTMLElement | null;
}

const ChevronIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClearIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 기본 필터: 레이블과 keywords 에 검색어가 들어 있는지 (대소문자 무시) */
export function defaultComboboxFilter(option: ComboboxOption, query: string): boolean {
  const q = query.trim().toLocaleLowerCase();
  if (!q) return true;
  return [option.label, ...(option.keywords ?? [])].some((text) =>
    text.toLocaleLowerCase().includes(q),
  );
}

/** 제어/비제어 상태를 하나로 다룬다 */
function useControllable<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (value: T) => void] {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : uncontrolled;
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });
  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChangeRef.current?.(next);
    },
    [isControlled],
  );
  return [value, setValue];
}

/** IME 조합 중인 키 입력인지. Safari 는 조합 종료 직후 keyCode 229 로 Enter 를 보낸다. */
function isComposingEvent(event: React.KeyboardEvent) {
  return event.nativeEvent.isComposing || event.keyCode === 229;
}

interface Item {
  option: ComboboxOption;
  /** options 배열에서의 위치 (id 를 안정적으로 만들기 위해) */
  index: number;
}

/**
 * 검색해서 하나를 고르는 입력. WAI-ARIA APG 의 "combobox with listbox popup" 패턴을 따른다.
 * DOM 포커스는 항상 입력창에 있고, 강조된 항목은 `aria-activedescendant` 로 전달된다.
 *
 * `className`·`style` 은 테두리를 그리는 바깥 래퍼에, 나머지 props 와 `ref` 는 `<input>` 에 전달된다.
 */
export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    options,
    value: valueProp,
    defaultValue = null,
    onValueChange,
    inputValue: inputValueProp,
    defaultInputValue,
    onInputValueChange,
    open: openProp,
    onOpenChange,
    filter = defaultComboboxFilter,
    size = 'md',
    invalid,
    emptyText = '결과가 없습니다',
    clearLabel = '지우기',
    clearable = true,
    formatResultCount,
    renderOption,
    container,
    name,
    className,
    style,
    id,
    disabled,
    required,
    readOnly,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    onKeyDown,
    onBlur,
    onClick,
    onCompositionStart,
    onCompositionEnd,
    ...rest
  },
  forwardedRef,
) {
  const field = useFieldContext();
  const control = useFieldControl({
    id,
    disabled,
    'aria-invalid': ariaInvalid ?? (invalid ? true : undefined),
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
  });
  const isRequired = required ?? field?.required ?? false;
  const isDisabled = Boolean(control.disabled);
  const isInvalid = control['aria-invalid'] === true || control['aria-invalid'] === 'true';

  const baseId = React.useId();
  const listboxId = `${baseId}-listbox`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const composingRef = React.useRef(false);

  const labelOf = React.useCallback(
    (v: string | null) => (v == null ? '' : (options.find((o) => o.value === v)?.label ?? '')),
    [options],
  );

  const [value, setValue] = useControllable<string | null>(valueProp, defaultValue, onValueChange);
  const [inputValue, setInputValue] = useControllable<string>(
    inputValueProp,
    defaultInputValue ?? labelOf(valueProp !== undefined ? valueProp : defaultValue),
    onInputValueChange,
  );
  const [open, setOpen] = useControllable<boolean>(openProp, false, onOpenChange);
  // null: 검색 중이 아님 → 전체 목록. 문자열: 사용자가 입력한 검색어
  const [query, setQuery] = React.useState<string | null>(null);
  const [highlighted, setHighlighted] = React.useState<number | null>(null);

  // 바깥에서 value 만 바뀌면(제어 모드) 입력창 텍스트를 맞춘다
  const lastValueRef = React.useRef(value);
  React.useEffect(() => {
    if (lastValueRef.current === value) return;
    lastValueRef.current = value;
    if (query === null) setInputValue(labelOf(value));
  }, [value, query, labelOf, setInputValue]);

  const allItems = React.useMemo<Item[]>(
    () => options.map((option, index) => ({ option, index })),
    [options],
  );
  const filterItems = React.useCallback(
    (q: string | null) =>
      q === null ? allItems : allItems.filter(({ option }) => filter(option, q)),
    [allItems, filter],
  );
  const items = React.useMemo(() => filterItems(query), [filterItems, query]);

  const enabledPositions = (list: Item[]) =>
    list.flatMap((item, pos) => (item.option.disabled ? [] : [pos]));

  const highlightedItem = highlighted != null ? items[highlighted] : undefined;
  const activeDescendant = open && highlightedItem ? optionId(highlightedItem.index) : undefined;

  // 강조된 항목을 목록 안에서 보이게 한다
  React.useEffect(() => {
    if (!activeDescendant) return;
    const el = contentRef.current?.querySelector<HTMLElement>(`[id="${activeDescendant}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeDescendant]);

  // 결과 개수를 정중하게(polite) 알린다. 타이핑마다 읽지 않도록 잠깐 기다린다.
  const resultText =
    items.length === 0
      ? emptyText
      : formatResultCount
        ? formatResultCount(items.length)
        : `${items.length}개 결과`;
  const searching = open && query !== null;
  const [announcement, setAnnouncement] = React.useState('');
  React.useEffect(() => {
    if (!searching) return;
    const timer = setTimeout(() => setAnnouncement(resultText), 500);
    return () => clearTimeout(timer);
  }, [searching, query, resultText]);
  // 검색 중이 아니면 이전 문구를 다시 읽지 않도록 비워 둔다
  const liveText = searching ? announcement : '';

  const openList = (highlight: 'first' | 'last' | 'selected' | 'none') => {
    if (isDisabled || readOnly) return;
    setOpen(true);
    const enabled = enabledPositions(items);
    if (highlight === 'none' || enabled.length === 0) return setHighlighted(null);
    if (highlight === 'selected') {
      const pos = items.findIndex((item) => item.option.value === value && !item.option.disabled);
      return setHighlighted(pos >= 0 ? pos : (enabled[0] ?? null));
    }
    setHighlighted(highlight === 'first' ? (enabled[0] ?? null) : (enabled.at(-1) ?? null));
  };

  const closeList = () => {
    setOpen(false);
    setHighlighted(null);
  };

  const commit = (option: ComboboxOption) => {
    if (option.disabled) return;
    lastValueRef.current = option.value;
    setValue(option.value);
    setInputValue(option.label);
    setQuery(null);
    closeList();
  };

  const clear = () => {
    lastValueRef.current = null;
    if (value !== null) setValue(null);
    setInputValue('');
    setQuery(null);
    setHighlighted(null);
  };

  /** 선택과 다른 텍스트가 남아 있으면 선택된 항목의 레이블로 되돌린다 */
  const revertInput = () => {
    setQuery(null);
    const label = labelOf(value);
    if (inputValue !== label) setInputValue(label);
  };

  const move = (delta: 1 | -1) => {
    const enabled = enabledPositions(items);
    if (enabled.length === 0) return setHighlighted(null);
    const current = highlighted == null ? -1 : enabled.indexOf(highlighted);
    const next =
      current === -1
        ? delta === 1
          ? 0
          : enabled.length - 1
        : (current + delta + enabled.length) % enabled.length;
    setHighlighted(enabled[next] ?? null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // IME 조합 중에도 change 가 오므로 조합 중인 글자까지 바로 거른다
    const text = event.target.value;
    setInputValue(text);
    setQuery(text);
    if (text === '' && value !== null) {
      // 입력을 모두 지우면 선택도 해제한다
      lastValueRef.current = null;
      setValue(null);
    }
    if (!open) setOpen(true);
    // 검색 중에는 첫 번째 결과를 자동으로 강조한다 (Enter 한 번으로 선택)
    const first = text.trim() ? enabledPositions(filterItems(text))[0] : undefined;
    setHighlighted(first ?? null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || isDisabled || readOnly) return;
    // 한글 조합 중의 Enter·화살표는 IME 가 처리한다
    if (isComposingEvent(event) || composingRef.current) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) openList(event.altKey ? 'none' : value != null ? 'selected' : 'first');
        else if (!event.altKey) move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) openList(event.altKey ? 'none' : 'last');
        else if (event.altKey) {
          if (highlightedItem) commit(highlightedItem.option);
          else closeList();
        } else move(-1);
        break;
      case 'Home':
      case 'End':
        // 커서는 입력창 안에서 움직이고, 시각적 포커스도 입력창으로 돌아온다 (APG)
        setHighlighted(null);
        break;
      case 'Enter':
        if (open && highlightedItem) {
          event.preventDefault();
          commit(highlightedItem.option);
        } else if (open) {
          event.preventDefault();
          closeList();
        }
        // 닫혀 있으면 기본 동작(폼 제출)을 막지 않는다
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          closeList();
          revertInput();
        } else if (inputValue !== '') {
          event.preventDefault();
          clear();
        }
        break;
      case 'Tab':
        if (open) {
          closeList();
          revertInput();
        }
        break;
      default:
        break;
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(event);
    const next = event.relatedTarget as Node | null;
    if (next && (anchorRef.current?.contains(next) || contentRef.current?.contains(next))) return;
    if (open) closeList();
    revertInput();
  };

  const toggleByPointer = () => {
    if (open) closeList();
    else openList(value != null ? 'selected' : 'none');
  };

  const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    toggleByPointer();
  };

  // 래퍼의 빈 곳(화살표 아이콘 영역)을 눌러도 입력으로 포커스하고 목록을 연다
  const handleWrapperMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const input = inputRef.current;
    if (!input || isDisabled || target === input || target.closest('button')) return;
    event.preventDefault();
    input.focus();
    toggleByPointer();
  };

  const showClear = clearable && !isDisabled && !readOnly && inputValue !== '';

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          closeList();
          revertInput();
        }
      }}
    >
      <PopoverPrimitive.Anchor asChild>
        {/* 마우스 편의 기능. 키보드 사용자는 input 에 직접 포커스한다 */}
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          ref={anchorRef}
          className={cx('hds-input', 'hds-combobox', className)}
          style={style}
          data-size={size}
          data-state={open ? 'open' : 'closed'}
          data-invalid={isInvalid ? '' : undefined}
          data-disabled={isDisabled ? '' : undefined}
          data-readonly={readOnly ? '' : undefined}
          onMouseDown={handleWrapperMouseDown}
        >
          <input
            {...rest}
            {...control}
            ref={composeRefs(inputRef, forwardedRef)}
            type="text"
            role="combobox"
            className="hds-input__control"
            value={inputValue}
            readOnly={readOnly}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={activeDescendant}
            aria-required={isRequired || undefined}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onClick={handleClick}
            onCompositionStart={(event) => {
              composingRef.current = true;
              onCompositionStart?.(event);
            }}
            onCompositionEnd={(event) => {
              composingRef.current = false;
              onCompositionEnd?.(event);
            }}
          />
          {showClear && (
            <button
              type="button"
              className="hds-combobox__clear"
              aria-label={clearLabel}
              // Esc 로도 지울 수 있으므로 Tab 순서에는 넣지 않는다
              tabIndex={-1}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                clear();
                inputRef.current?.focus();
              }}
            >
              <ClearIcon />
            </button>
          )}
          <span className="hds-combobox__icon" aria-hidden="true">
            <ChevronIcon />
          </span>
        </div>
      </PopoverPrimitive.Anchor>

      {name && <input type="hidden" name={name} value={value ?? ''} />}

      <span className="hds-visually-hidden" role="status" aria-live="polite" aria-atomic="true">
        {liveText}
      </span>

      <PopoverPrimitive.Portal container={container}>
        <PopoverPrimitive.Content
          ref={contentRef}
          // Popover 는 기본으로 role="dialog" 를 준다. 여기서는 목록을 감싸는 상자일 뿐이다.
          role={undefined}
          className="hds-combobox__content"
          align="start"
          sideOffset={4}
          collisionPadding={8}
          // 포커스는 항상 입력창에 남는다
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={(event) => {
            if (anchorRef.current?.contains(event.target as Node)) event.preventDefault();
          }}
        >
          {/* 결과가 없어도 listbox 는 남겨 둔다: aria-controls 가 항상 실제 요소를 가리켜야 한다 */}
          <div
            id={listboxId}
            role="listbox"
            aria-labelledby={field?.labelId ?? ariaLabelledBy}
            aria-label={field || ariaLabelledBy ? undefined : rest['aria-label']}
            className="hds-combobox__listbox"
          >
            {items.map(({ option, index }, pos) => {
              const selected = option.value === value;
              const isHighlighted = pos === highlighted;
              return (
                // 항목은 일부러 포커스를 받지 않는다 (aria-activedescendant 패턴).
                // 키보드는 입력창의 onKeyDown 이 처리하고, 여기 onClick 은 마우스 선택용이다.
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
                <div
                  key={option.value}
                  id={optionId(index)}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={option.disabled || undefined}
                  className="hds-combobox__option"
                  data-highlighted={isHighlighted ? '' : undefined}
                  data-selected={selected ? '' : undefined}
                  data-disabled={option.disabled ? '' : undefined}
                  // 누르는 동안 입력창의 포커스를 유지한다 (목록은 aria-activedescendant 로만 조작)
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => commit(option)}
                  onMouseMove={() => {
                    if (!option.disabled && highlighted !== pos) setHighlighted(pos);
                  }}
                >
                  <span className="hds-combobox__option-text">
                    {renderOption
                      ? renderOption(option, { selected, highlighted: isHighlighted })
                      : option.label}
                  </span>
                  {selected && (
                    <span className="hds-combobox__check">
                      <CheckIcon />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {items.length === 0 && <div className="hds-combobox__empty">{emptyText}</div>}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
});
