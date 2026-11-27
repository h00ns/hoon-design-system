import * as React from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';
import { cx } from '../utils/cx';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 이미지 주소. 없거나 로드에 실패하면 이니셜(또는 기본 아이콘)을 보여준다. */
  src?: string;
  /**
   * 대체 텍스트.
   * - 생략하면 `name` 을 쓴다.
   * - 바로 옆에 이름이 텍스트로 있어 중복이면 `""` 로 장식 처리한다.
   */
  alt?: string;
  /** 사람·조직 이름. 이니셜과 기본 대체 텍스트에 쓰인다. */
  name?: string;
  /** 이니셜 대신 보여줄 내용. */
  fallback?: React.ReactNode;
  /** @default 'md' */
  size?: AvatarSize;
  /** 사람은 circle, 조직·서비스는 square. @default 'circle' */
  shape?: AvatarShape;
  /**
   * 이니셜 배경색. `auto` 는 이름에서 색을 정해, 같은 이름은 항상 같은 색이 된다
   * (목록에서 사람을 구분하기 쉽게). 이름이 없으면 회색. @default 'auto'
   */
  color?: AvatarColor;
}

export type AvatarColor = 'auto' | 'gray' | 'blue' | 'green' | 'amber' | 'red';

const AUTO_COLORS = ['blue', 'green', 'amber', 'red'] as const;

/** 이름 → 색 (간단한 문자열 해시). 같은 이름은 항상 같은 색 */
export function getAvatarColor(name: string): Exclude<AvatarColor, 'auto'> {
  const trimmed = name.trim();
  if (!trimmed) return 'gray';
  let hash = 0;
  for (const ch of trimmed) hash = (hash * 31 + (ch.codePointAt(0) ?? 0)) >>> 0;
  return AUTO_COLORS[hash % AUTO_COLORS.length]!;
}

const HANGUL = /^[ㄱ-ㆎ가-힣]+$/;

/**
 * 이름에서 이니셜을 만든다.
 * - 한글 이름: 3자 이상이면 성을 뺀 마지막 두 글자("홍길동" → "길동"), 2자 이하면 그대로
 * - 공백으로 나뉜 이름: 첫 단어와 마지막 단어의 첫 글자 ("Jane Doe" → "JD")
 * - 그 외: 첫 글자
 */
export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';
  const words = trimmed.split(/\s+/);

  if (words.length === 1 && HANGUL.test(trimmed)) {
    const chars = Array.from(trimmed);
    return chars.length >= 3 ? chars.slice(-2).join('') : trimmed;
  }

  const first = Array.from(words[0] ?? '')[0] ?? '';
  if (words.length === 1) return first.toUpperCase();
  const last = Array.from(words[words.length - 1] ?? '')[0] ?? '';
  return `${first}${last}`.toUpperCase();
}

const PersonIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6.5 7a6.5 6.5 0 0 1 13 0 .75.75 0 0 1-.75.75H4.25A.75.75 0 0 1 3.5 17Z" />
  </svg>
);

/** 사람이나 조직을 나타내는 이미지. 이미지가 없으면 이니셜로 대체한다. */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, alt, name, fallback, size = 'md', shape = 'circle', color = 'auto', className, ...rest },
  ref,
) {
  const label = alt ?? name ?? '';
  const initials = name ? getInitials(name) : '';
  const fallbackContent = fallback ?? (initials || <PersonIcon />);

  return (
    <AvatarPrimitive.Root
      {...rest}
      ref={ref}
      className={cx('hds-avatar', className)}
      data-size={size}
      data-shape={shape}
      data-color={color === 'auto' ? getAvatarColor(name ?? '') : color}
    >
      {src && <AvatarPrimitive.Image className="hds-avatar__image" src={src} alt={label} />}
      <AvatarPrimitive.Fallback
        className="hds-avatar__fallback"
        // 이미지가 있으면 잠깐 기다렸다가 대체 내용을 보여 깜빡임을 줄인다
        delayMs={src ? 600 : undefined}
        role={label ? 'img' : undefined}
        aria-label={label || undefined}
        aria-hidden={label ? undefined : true}
      >
        <span aria-hidden="true">{fallbackContent}</span>
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
});
