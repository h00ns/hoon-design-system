/**
 * 시맨틱 색상 조합이 WCAG 2.2 대비 기준을 만족하는지 검증한다.
 * - 텍스트: 1.4.3 (AA) 4.5:1
 * - UI 컴포넌트 경계·포커스 표시: 1.4.11 3:1
 * 토큰 값을 바꾸다 기준이 깨지면 이 테스트가 실패한다.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type Theme = 'light' | 'dark';

const load = (theme: Theme): Record<string, string> =>
  JSON.parse(readFileSync(new URL(`../dist/json/${theme}.json`, import.meta.url), 'utf8'));

function toRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  if (h.length !== 6) throw new Error(`불투명 6자리 hex만 대비 계산이 가능합니다: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
}

function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  ) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (l1 + 0.05) / (l2 + 0.05);
}

const TEXT = 4.5;
const UI = 3;

/** [전경, 배경, 최소 대비] — 토큰 이름은 `color-` 접두사 생략 */
const PAIRS: Array<[string, string, number]> = [
  ['fg-default', 'bg-default', TEXT],
  ['fg-default', 'bg-subtle', TEXT],
  ['fg-default', 'bg-muted', TEXT],
  ['fg-default', 'neutral-subtle-active', TEXT],
  ['fg-default', 'bg-raised', TEXT],
  ['fg-muted', 'bg-raised', TEXT],
  ['accent-fg', 'bg-raised', TEXT],
  ['danger-fg', 'bg-raised', TEXT],
  ['border-control', 'bg-raised', UI],
  ['fg-muted', 'bg-default', TEXT],
  ['fg-muted', 'bg-subtle', TEXT],
  ['fg-inverse', 'bg-inverse', TEXT],

  ['fg-on-accent', 'accent-solid', TEXT],
  ['fg-on-accent', 'accent-solid-hover', TEXT],
  ['fg-on-accent', 'accent-solid-active', TEXT],
  ['accent-fg', 'bg-default', TEXT],
  ['accent-fg', 'bg-subtle', TEXT],
  ['accent-fg', 'accent-subtle', TEXT],
  ['accent-fg', 'accent-subtle-hover', TEXT],

  ['fg-on-accent', 'danger-solid', TEXT],
  ['fg-on-accent', 'danger-solid-hover', TEXT],
  ['fg-on-accent', 'danger-solid-active', TEXT],
  ['danger-fg', 'bg-default', TEXT],
  ['danger-fg', 'danger-subtle', TEXT],

  ['fg-on-accent', 'success-solid', TEXT],
  ['success-fg', 'bg-default', TEXT],
  ['success-fg', 'success-subtle', TEXT],

  ['fg-on-warning', 'warning-solid', TEXT],
  ['warning-fg', 'bg-default', TEXT],
  ['warning-fg', 'warning-subtle', TEXT],

  ['border-control', 'bg-default', UI],
  ['border-control', 'bg-subtle', UI],
  ['focus-ring', 'bg-default', UI],
  ['focus-ring', 'bg-subtle', UI],
];

describe.each<Theme>(['light', 'dark'])('%s 테마 대비', (theme) => {
  const tokens = load(theme);
  const get = (name: string) => {
    const value = tokens[`color-${name}`];
    if (!value) throw new Error(`토큰 없음: color-${name}`);
    return value;
  };

  it.each(PAIRS)('%s / %s ≥ %d:1', (fg, bg, min) => {
    const ratio = contrast(get(fg), get(bg));
    expect(ratio, `${fg} on ${bg} = ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min);
  });
});
