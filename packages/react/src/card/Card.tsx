import * as React from 'react';
import { Slot } from 'radix-ui';
import { cx } from '../utils/cx';

export type CardVariant = 'outline' | 'elevated' | 'subtle';
export type CardPadding = 'sm' | 'md' | 'lg';

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

export interface CardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `outline`: 테두리 · `elevated`: 그림자 · `subtle`: 옅은 배경. @default 'outline' */
  variant?: CardVariant;
  /** 안쪽 여백. @default 'md' */
  padding?: CardPadding;
  /**
   * 카드 전체를 누를 수 있는 카드로 만든다. 안에 `Card.Link` 를 **하나** 두면
   * 그 링크의 클릭 영역이 카드 전체로 넓어진다 (카드 자체를 클릭 가능한 div 로 만들지 않는다).
   * 카드 안의 다른 버튼·링크는 그대로 따로 동작한다.
   * @default false
   */
  interactive?: boolean;
  /** 자식 요소를 루트로 렌더링한다 (예: `<article>`, `<li>`). */
  asChild?: boolean;
}

const Root = React.forwardRef<HTMLDivElement, CardRootProps>(function CardRoot(
  { variant = 'outline', padding = 'md', interactive = false, asChild = false, className, ...rest },
  ref,
) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      {...rest}
      ref={ref}
      className={cx('hds-card', className)}
      data-variant={variant}
      data-padding={padding}
      data-interactive={interactive ? '' : undefined}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * Header / Body / Footer
 * -----------------------------------------------------------------------------------------------*/

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const Header = React.forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { className, ...rest },
  ref,
) {
  return <div {...rest} ref={ref} className={cx('hds-card__header', className)} />;
});

export type CardBodyProps = React.HTMLAttributes<HTMLDivElement>;

const Body = React.forwardRef<HTMLDivElement, CardBodyProps>(function CardBody(
  { className, ...rest },
  ref,
) {
  return <div {...rest} ref={ref} className={cx('hds-card__body', className)} />;
});

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

const Footer = React.forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { className, ...rest },
  ref,
) {
  return <div {...rest} ref={ref} className={cx('hds-card__footer', className)} />;
});

/* -------------------------------------------------------------------------------------------------
 * Title / Description
 * -----------------------------------------------------------------------------------------------*/

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * 기본은 `<h3>`. 페이지의 제목 구조에 맞는 수준이 다르면 `asChild` 로 바꾼다:
   * `<Card.Title asChild><h2>…</h2></Card.Title>`
   */
  asChild?: boolean;
}

const Title = React.forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { asChild = false, className, ...rest },
  ref,
) {
  const Comp = asChild ? Slot.Root : 'h3';
  return <Comp {...rest} ref={ref} className={cx('hds-card__title', className)} />;
});

export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const Description = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ className, ...rest }, ref) {
    return <p {...rest} ref={ref} className={cx('hds-card__description', className)} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * Link
 * -----------------------------------------------------------------------------------------------*/

export interface CardLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 라우터의 `<Link>` 등을 루트로 렌더링한다. */
  asChild?: boolean;
}

/**
 * `interactive` 카드의 대표 링크. 보통 제목 안에 둔다:
 * `<Card.Title><Card.Link href="…">제목</Card.Link></Card.Title>`
 * 링크의 이름이 곧 카드의 이름이 되므로 스크린리더는 카드 전체가 아니라 제목만 읽는다.
 */
const Link = React.forwardRef<HTMLAnchorElement, CardLinkProps>(function CardLink(
  { asChild = false, className, ...rest },
  ref,
) {
  const Comp = asChild ? Slot.Root : 'a';
  return <Comp {...rest} ref={ref} className={cx('hds-card__link', className)} />;
});

export { Root, Header, Title, Description, Body, Footer, Link };
