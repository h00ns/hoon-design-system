import * as React from 'react';
import { Slider as SliderPrimitive } from 'radix-ui';
import { useFieldContext, useFieldControl } from '../field/field-context';
import { cx } from '../utils/cx';
import { mergeIds } from '../utils/merge-ids';

export type SliderSize = 'sm' | 'md';

export interface SliderMark {
  value: number;
  /** 눈금 아래에 보일 텍스트. 생략하면 점만 찍힌다. */
  label?: React.ReactNode;
}

type PrimitiveRootProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

export interface SliderProps extends Omit<PrimitiveRootProps, 'asChild' | 'children'> {
  /** 트랙 굵기와 손잡이 크기. @default 'md' */
  size?: SliderSize;
  /** 오류 상태. Field 안에서는 `Field.Root invalid` 로 자동 연결된다. */
  invalid?: boolean;
  /**
   * 손잡이마다의 접근 가능한 이름. 범위 슬라이더(손잡이 2개)는 기본 `['최솟값', '최댓값']`.
   * Field 레이블이나 `aria-label` 과 합쳐 "가격 최솟값"처럼 읽힌다.
   */
  thumbLabels?: string[];
  /**
   * 스크린리더가 읽을 값 문구 (`aria-valuetext`). 단위가 있으면 꼭 준다.
   * 예: `(v) => \`${v.toLocaleString()}원\``
   */
  getValueText?: (value: number, index: number) => string;
  /** 트랙 아래 눈금. 시각 보조이며 값은 손잡이가 전달한다. */
  marks?: SliderMark[];
}

const DEFAULT_RANGE_LABELS = ['최솟값', '최댓값'];

/**
 * 범위 안에서 값을 고르는 슬라이더. 값 배열에 숫자가 2개면 범위 슬라이더가 된다.
 * `className`·`style` 은 바깥 래퍼에, `ref` 는 Radix Slider Root 에 전달된다.
 */
export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  {
    size = 'md',
    invalid,
    thumbLabels,
    getValueText,
    marks,
    className,
    style,
    value: valueProp,
    defaultValue,
    onValueChange,
    min = 0,
    max = 100,
    orientation = 'horizontal',
    disabled,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    ...rest
  },
  ref,
) {
  const field = useFieldContext();
  const control = useFieldControl(
    {
      id,
      disabled,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid ?? (invalid ? true : undefined),
    },
    { labelledBy: true },
  );
  const isDisabled = Boolean(control.disabled ?? field?.disabled);
  const isInvalid = control['aria-invalid'] === true || control['aria-invalid'] === 'true';

  // 손잡이 개수와 aria-valuetext 를 위해 현재 값을 직접 들고 있는다
  const [uncontrolled, setUncontrolled] = React.useState<number[]>(defaultValue ?? [min]);
  const values = valueProp ?? uncontrolled;
  const handleValueChange = (next: number[]) => {
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  const thumbId = (index: number) => (index === 0 ? control.id : `${control.id}-${index}`);
  const labels = thumbLabels ?? (values.length === 2 ? DEFAULT_RANGE_LABELS : []);

  const percent = (v: number) => (max === min ? 0 : ((v - min) / (max - min)) * 100);

  return (
    <div
      className={cx('hds-slider', className)}
      style={style}
      data-size={size}
      data-orientation={orientation}
      data-invalid={isInvalid ? '' : undefined}
      data-disabled={isDisabled ? '' : undefined}
    >
      <SliderPrimitive.Root
        {...rest}
        ref={ref}
        className="hds-slider__root"
        value={values}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        orientation={orientation}
        disabled={isDisabled}
      >
        <SliderPrimitive.Track className="hds-slider__track">
          <SliderPrimitive.Range className="hds-slider__range" />
        </SliderPrimitive.Track>
        {values.map((v, index) => {
          const own = labels[index];
          const tid = thumbId(index);
          // 그룹 레이블(Field·aria-labelledby) + 손잡이 이름을 함께 읽게 한다
          const labelledBy = control['aria-labelledby'];
          const name = own
            ? labelledBy
              ? { 'aria-label': own, 'aria-labelledby': mergeIds(labelledBy, tid) }
              : { 'aria-label': ariaLabel ? `${ariaLabel} ${own}` : own }
            : labelledBy
              ? { 'aria-labelledby': labelledBy }
              : { 'aria-label': ariaLabel };
          return (
            <SliderPrimitive.Thumb
              // 손잡이 수는 값 배열 길이로만 바뀐다
              key={index}
              id={tid}
              className="hds-slider__thumb"
              {...name}
              aria-describedby={control['aria-describedby']}
              aria-invalid={control['aria-invalid']}
              aria-valuetext={getValueText?.(v, index)}
            />
          );
        })}
      </SliderPrimitive.Root>
      {marks && marks.length > 0 && (
        <div className="hds-slider__marks" aria-hidden="true">
          {marks.map((mark) => (
            <span
              key={mark.value}
              className="hds-slider__mark"
              style={{ '--_p': percent(mark.value) } as React.CSSProperties}
              data-active={
                values.length === 1
                  ? mark.value <= (values[0] ?? min) || undefined
                  : (mark.value >= Math.min(...values) && mark.value <= Math.max(...values)) ||
                    undefined
              }
            >
              <span className="hds-slider__mark-dot" />
              {mark.label != null && <span className="hds-slider__mark-label">{mark.label}</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});
