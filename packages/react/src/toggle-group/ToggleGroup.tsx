import * as React from 'react';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import { useFieldContext, useFieldControl } from '../field/field-context';
import { cx } from '../utils/cx';
import type { ToggleContentProps, ToggleSize } from './Toggle';
import { ToggleContent } from './toggle-content';

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

export type ToggleGroupRootProps = React.ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Root
> & {
  /** 항목 크기. @default 'md' */
  size?: ToggleSize;
};

/**
 * 관련된 토글 묶음. 화살표 키로 항목 사이를 이동한다 (roving focus).
 * - `type="single"`: 하나만 고른다 (radiogroup). 다시 눌러 해제할 수 있다.
 * - `type="multiple"`: 여러 개를 켠다 (toolbar).
 *
 * 묶음에는 `aria-label` 이나 Field.Label 로 이름을 준다.
 */
const Root = React.forwardRef<HTMLDivElement, ToggleGroupRootProps>(function ToggleGroupRoot(
  { size = 'md', className, ...rest },
  ref,
) {
  const field = useFieldContext();
  const control = useFieldControl(
    {
      id: rest.id,
      disabled: rest.disabled,
      'aria-labelledby': rest['aria-labelledby'],
      'aria-describedby': rest['aria-describedby'],
    },
    { labelledBy: true },
  );
  return (
    <ToggleGroupPrimitive.Root
      {...rest}
      ref={ref}
      id={control.id}
      disabled={Boolean(control.disabled ?? field?.disabled)}
      aria-labelledby={control['aria-labelledby']}
      aria-describedby={control['aria-describedby']}
      className={cx('hds-toggle-group', className)}
      data-size={size}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * Item
 * -----------------------------------------------------------------------------------------------*/

export type ToggleGroupItemProps = Omit<
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
  'asChild' | 'children' | 'aria-label'
> &
  ToggleContentProps;

const Item = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(function ToggleGroupItem(
  { className, icon, children, ...rest },
  ref,
) {
  return (
    <ToggleGroupPrimitive.Item
      {...rest}
      ref={ref}
      className={cx('hds-toggle', 'hds-toggle-group__item', className)}
      data-icon-only={children == null ? '' : undefined}
    >
      <ToggleContent icon={icon}>{children}</ToggleContent>
    </ToggleGroupPrimitive.Item>
  );
});

export { Root, Item };
