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

type Rgba = [number, number, number, number];

/** '#rrggbb', '#rrggbbaa', 'rgba(r, g, b, a)' 를 0~1 범위 RGBA 로 */
function parse(color: string): Rgba {
  const m = color.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const [r, g, b, a = '1'] = m[1]!.split(',').map((v) => v.trim());
    return [Number(r) / 255, Number(g) / 255, Number(b) / 255, Number(a)];
  }
  const h = color.replace('#', '');
  if (h.length !== 6 && h.length !== 8) throw new Error(`색 형식을 알 수 없습니다: ${color}`);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [
    number,
    number,
    number,
  ];
  return [r, g, b, h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
}

/** 반투명 색은 아래 배경 위에 겹친 결과로 계산한다 */
function over(top: Rgba, bottom: Rgba): Rgba {
  const a = top[3];
  return [0, 1, 2].map((i) => top[i]! * a + bottom[i]! * (1 - a)).concat(1) as Rgba;
}

function toRgb(color: Rgba): [number, number, number] {
  return [color[0], color[1], color[2]];
}

function luminance(color: Rgba): number {
  const [r, g, b] = toRgb(color).map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  ) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: Rgba, b: Rgba): number {
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
  ['critical-fg', 'bg-raised', TEXT],
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
  ['accent-fg', 'bg-muted', TEXT],

  ['fg-on-accent', 'critical-solid', TEXT],
  ['fg-on-accent', 'critical-solid-hover', TEXT],
  ['fg-on-accent', 'critical-solid-active', TEXT],
  ['critical-fg', 'bg-default', TEXT],
  ['critical-fg', 'critical-subtle', TEXT],
  ['critical-fg', 'critical-subtle-hover', TEXT],

  ['fg-on-accent', 'success-solid', TEXT],
  ['success-fg', 'bg-default', TEXT],
  ['success-fg', 'success-subtle', TEXT],
  ['success-fg', 'success-subtle-hover', TEXT],
  ['fg-on-accent', 'success-solid-hover', TEXT],

  ['fg-on-warning', 'warning-solid', TEXT],
  ['warning-fg', 'bg-default', TEXT],
  ['warning-fg', 'warning-subtle', TEXT],
  ['warning-fg', 'warning-subtle-hover', TEXT],
  ['fg-on-warning', 'warning-solid-hover', TEXT],
  ['fg-default', 'neutral-subtle', TEXT],
  // Badge (옅은 배경은 subtle-hover 단계)
  ['fg-muted', 'neutral-subtle', TEXT],
  ['accent-fg', 'accent-subtle-hover', TEXT],
  ['fg-on-warning', 'warning-solid', TEXT],
  // 상태 아이콘: 안쪽 기호가 바탕 도형과 구분되어야 한다
  ['accent-icon-mark', 'accent-icon', UI],
  ['success-icon-mark', 'success-icon', UI],
  ['warning-icon-mark', 'warning-icon', UI],
  ['critical-icon-mark', 'critical-icon', UI],
  // Alert 본문 (제목 아래 보조 텍스트)
  ['fg-muted', 'accent-subtle', TEXT],
  ['fg-muted', 'critical-subtle', TEXT],
  ['fg-muted', 'success-subtle', TEXT],
  ['fg-muted', 'warning-subtle', TEXT],
  ['fg-default', 'warning-subtle', TEXT],
  ['fg-default', 'neutral-subtle-hover', TEXT],

  ['border-control', 'bg-default', UI],
  ['border-control', 'bg-subtle', UI],
  ['focus-ring', 'bg-default', UI],
  ['focus-ring', 'bg-subtle', UI],
];

describe.each<Theme>(['light', 'dark'])('%s 테마 대비', (theme) => {
  const tokens = load(theme);
  const raw = (name: string) => {
    const value = tokens[`color-${name}`];
    if (!value) throw new Error(`토큰 없음: color-${name}`);
    return parse(value);
  };
  const page = raw('bg-default');
  // 반투명 토큰은 페이지 배경 위에 놓였을 때의 색으로 계산
  const get = (name: string) => over(raw(name), page);

  it.each(PAIRS)('%s / %s ≥ %d:1', (fg, bg, min) => {
    const ratio = contrast(over(raw(fg), get(bg)), get(bg));
    expect(ratio, `${fg} on ${bg} = ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min);
  });
});
