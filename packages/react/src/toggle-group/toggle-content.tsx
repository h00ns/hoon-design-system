import type * as React from 'react';

/** Toggle·ToggleGroup.Item 공통: 장식용 아이콘(보조기기에서 숨김) + 텍스트 */
export function ToggleContent({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <>
      {icon != null && (
        <span className="hds-toggle__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </>
  );
}
