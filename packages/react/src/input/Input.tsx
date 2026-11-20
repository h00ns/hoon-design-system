import * as React from 'react';
import { useFieldControl } from '../field/field-context';
import { cx } from '../utils/cx';
import { composeRefs } from './compose-refs';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** 높이. Button 의 size 와 같은 단계라 나란히 놓으면 높이가 맞는다. @default 'md' */
  size?: InputSize;
  /**
   * 오류 상태. `aria-invalid="true"` 로 표현된다.
   * Field 안에서는 `Field.Root invalid` 를 쓰면 자동으로 연결된다.
   */
  invalid?: boolean;
  /**
   * 입력 앞에 붙는 요소 (검색 아이콘, 통화 기호 등).
   * 장식용 아이콘은 `aria-hidden` 을 주고, 의미 있는 단위는 레이블이나 설명에도 적는다.
   */
  startSlot?: React.ReactNode;
  /** 입력 뒤에 붙는 요소 (단위, 비밀번호 보기 버튼 등). 버튼을 넣으면 그대로 포커스할 수 있다. */
  endSlot?: React.ReactNode;
}

const INTERACTIVE = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * 한 줄 텍스트 입력.
 * `className`·`style` 은 테두리를 그리는 바깥 래퍼에, 나머지 props 와 `ref` 는 `<input>` 에 전달된다.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    invalid,
    startSlot,
    endSlot,
    className,
    style,
    type = 'text',
    id,
    disabled,
    required,
    readOnly,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  },
  forwardedRef,
) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const control = useFieldControl({
    id,
    disabled,
    required,
    'aria-invalid': ariaInvalid ?? (invalid ? true : undefined),
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
  });

  const isInvalid = control['aria-invalid'] === true || control['aria-invalid'] === 'true';

  // 슬롯의 빈 영역을 눌러도 입력으로 포커스가 가도록 한다 (슬롯 안 버튼·링크는 그대로 동작)
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const input = inputRef.current;
    if (!input || target === input || target.closest(INTERACTIVE)) return;
    event.preventDefault();
    input.focus();
  };

  return (
    // 마우스 편의 기능일 뿐 키보드 사용자는 input 에 직접 포커스한다
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cx('hds-input', className)}
      style={style}
      data-size={size}
      data-invalid={isInvalid ? '' : undefined}
      data-disabled={control.disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
      onMouseDown={handleMouseDown}
    >
      {startSlot != null && (
        <span className="hds-input__slot" data-position="start">
          {startSlot}
        </span>
      )}
      <input
        {...rest}
        {...control}
        ref={composeRefs(inputRef, forwardedRef)}
        type={type}
        readOnly={readOnly}
        className="hds-input__control"
      />
      {endSlot != null && (
        <span className="hds-input__slot" data-position="end">
          {endSlot}
        </span>
      )}
    </div>
  );
});
