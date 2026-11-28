import * as React from 'react';

export type IconWeight = 'regular' | 'bold' | 'fill';

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'ref' | 'children'> {
  /**
   * 가로·세로 크기. 숫자는 px 로 처리한다.
   * 기본값 `'1em'` 은 주변 글자 크기를 따라가서 버튼·텍스트 안에서 따로 맞출 필요가 없다.
   * @default '1em'
   */
  size?: number | string;
  /**
   * 획 굵기. 본문 옆은 `regular`, 작은 크기(16px 이하)나 강조에는 `bold`,
   * 선택된 상태(즐겨찾기 켜짐 등)는 `fill` 을 쓴다.
   * @default 'regular'
   */
  weight?: IconWeight;
  /**
   * 아이콘만으로 의미를 전달할 때의 접근 가능한 이름.
   * 주면 `role="img"` 와 `<title>` 로 읽히고, 없으면 장식으로 보고 `aria-hidden` 처리한다.
   * 버튼 안의 아이콘이라면 이 값 대신 버튼에 이름을 붙인다.
   */
  title?: string;
  /** 오른쪽→왼쪽(RTL) 문서에서 방향 아이콘을 좌우 반전한다. */
  mirrored?: boolean;
}

export type Icon = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
> & {
  /** kebab-case 아이콘 이름 */
  readonly iconName: string;
};

/** @internal 생성된 아이콘 데이터로 컴포넌트를 만든다. */
export function createIcon(
  displayName: string,
  iconName: string,
  paths: Record<IconWeight, string>,
): Icon {
  const Component = React.forwardRef<SVGSVGElement, IconProps>(function Icon(
    {
      size = '1em',
      weight = 'regular',
      title,
      mirrored,
      color = 'currentColor',
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const titleId = React.useId();
    const hasTitle = title != null && title !== '';
    // aria-label / aria-labelledby 를 직접 줬다면 그것도 이름으로 인정한다
    const labelled = hasTitle || rest['aria-label'] != null || rest['aria-labelledby'] != null;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        width={size}
        height={size}
        fill={color}
        className={className ? `hds-icon ${className}` : 'hds-icon'}
        data-icon={iconName}
        style={mirrored ? { transform: 'scaleX(-1)', ...style } : style}
        {...(labelled
          ? { role: 'img', 'aria-labelledby': hasTitle ? titleId : undefined }
          : { 'aria-hidden': true, focusable: 'false' })}
        {...rest}
      >
        {hasTitle ? <title id={titleId}>{title}</title> : null}
        <path d={paths[weight] ?? paths.regular} />
      </svg>
    );
  });
  Component.displayName = displayName;
  return Object.assign(Component, { iconName });
}
