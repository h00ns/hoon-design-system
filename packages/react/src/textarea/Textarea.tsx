import * as React from 'react';
import { useFieldControl } from '../field/field-context';
import { composeRefs } from '../input/compose-refs';
import { cx } from '../utils/cx';
import { useIsomorphicLayoutEffect } from '../utils/use-isomorphic-layout-effect';

export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 오류 상태. `aria-invalid="true"` 로 표현된다. Field 안에서는 `Field.Root invalid` 로 자동 연결. */
  invalid?: boolean;
  /** 사용자가 크기를 조절할 수 있는 방향. `autoResize` 이면 기본 'none'. @default 'vertical' */
  resize?: TextareaResize;
  /** 내용에 맞춰 높이가 자동으로 늘어난다 (`minRows` ~ `maxRows`). @default false */
  autoResize?: boolean;
  /** 최소 줄 수. `rows` 와 같다. @default 3 */
  minRows?: number;
  /** autoResize 일 때 최대 줄 수. 넘으면 스크롤된다. */
  maxRows?: number;
}

const supportsFieldSizing = () =>
  typeof CSS !== 'undefined' &&
  typeof CSS.supports === 'function' &&
  CSS.supports('field-sizing', 'content');

/** 여러 줄 텍스트 입력. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    invalid,
    resize,
    autoResize = false,
    minRows = 3,
    maxRows,
    rows,
    className,
    style,
    id,
    disabled,
    required,
    readOnly,
    onInput,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  },
  forwardedRef,
) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const control = useFieldControl({
    id,
    disabled,
    required,
    'aria-invalid': ariaInvalid ?? (invalid ? true : undefined),
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
  });
  const isInvalid = control['aria-invalid'] === true || control['aria-invalid'] === 'true';
  const min = rows ?? minRows;

  // field-sizing 을 지원하지 않는 브라우저(구형 Safari·Firefox)용 JS 대체 구현
  const fitContent = React.useCallback(() => {
    const el = ref.current;
    if (!el || !autoResize || supportsFieldSizing()) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + (el.offsetHeight - el.clientHeight)}px`;
  }, [autoResize]);

  useIsomorphicLayoutEffect(() => {
    fitContent();
  }, [fitContent, rest.value]);

  return (
    <textarea
      {...rest}
      {...control}
      ref={composeRefs(ref, forwardedRef)}
      rows={min}
      readOnly={readOnly}
      className={cx('hds-textarea', className)}
      style={
        {
          ...style,
          '--_min-rows': min,
          ...(maxRows ? { '--_max-rows': maxRows } : null),
        } as React.CSSProperties
      }
      data-resize={resize ?? (autoResize ? 'none' : 'vertical')}
      data-auto-resize={autoResize ? '' : undefined}
      data-invalid={isInvalid ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
      onInput={(event) => {
        fitContent();
        onInput?.(event);
      }}
    />
  );
});
