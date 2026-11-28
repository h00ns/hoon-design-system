/**
 * Foundations 문서용 토큰 시각화 블록.
 * 값은 빌드된 @hoon-ds/tokens JSON 에서 읽으므로 토큰을 바꾸면 문서도 자동으로 바뀐다.
 */
import dark from '@hoon-ds/tokens/json/dark';
import light from '@hoon-ds/tokens/json/light';
import type { CSSProperties, ReactNode } from 'react';

type Tokens = Record<string, string | number>;
const LIGHT = light as Tokens;
const DARK = dark as Tokens;

const cssVar = (key: string) => `--hds-${key}`;
const keysWith = (prefix: string) => Object.keys(LIGHT).filter((k) => k.startsWith(prefix));

/* ── 공통 스타일 ───────────────────────────── */
const mono: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 12,
};
const muted: CSSProperties = { color: 'var(--sl-color-gray-3)' };
const table: CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 14 };
const th: CSSProperties = {
  textAlign: 'left',
  padding: '8px 12px',
  borderBottom: '2px solid var(--sl-color-gray-5)',
  fontWeight: 600,
};
const td: CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid var(--sl-color-gray-6)',
  verticalAlign: 'middle',
};

function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <table style={table}>
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h} style={th}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

function Code({ children }: { children: ReactNode }) {
  return (
    <code
      style={{
        ...mono,
        padding: '1px 5px',
        borderRadius: 4,
        background: 'var(--hds-color-bg-muted)',
        color: 'var(--hds-color-fg-default)',
        overflowWrap: 'anywhere',
        wordBreak: 'normal',
      }}
    >
      {children}
    </code>
  );
}

/* ── 대비 계산 ─────────────────────────────── */
function luminance(hex: string): number {
  const h = hex.replace('#', '').slice(0, 6);
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as [
    number,
    number,
    number,
  ];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (l1 + 0.05) / (l2 + 0.05);
}

function ContrastBadge({ ratio }: { ratio: number }) {
  const level = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large · UI' : '부족';
  const ok = ratio >= 4.5;
  return (
    <span
      style={{
        ...mono,
        padding: '2px 6px',
        borderRadius: 4,
        background: ok
          ? 'var(--hds-color-success-subtle)'
          : ratio >= 3
            ? 'var(--hds-color-warning-subtle)'
            : 'var(--hds-color-critical-subtle)',
        color: ok
          ? 'var(--hds-color-success-fg)'
          : ratio >= 3
            ? 'var(--hds-color-warning-fg)'
            : 'var(--hds-color-critical-fg)',
        whiteSpace: 'nowrap',
      }}
    >
      {ratio.toFixed(2)}:1 {level}
    </span>
  );
}

/* ── Colors ────────────────────────────────── */
const SCALES = ['gray', 'blue', 'red', 'green', 'amber'] as const;

/** primitive 팔레트. 컴포넌트에서 직접 쓰지 않고 시맨틱 토큰을 거친다. */
export function PrimitivePalette() {
  return (
    <div className="not-content" style={{ display: 'grid', gap: 20 }}>
      {SCALES.map((scale) => {
        const keys = keysWith(`color-${scale}-`);
        return (
          <div key={scale}>
            <div style={{ fontWeight: 600, marginBottom: 8, textTransform: 'capitalize' }}>
              {scale}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(4.5rem, 1fr))',
                gap: 4,
              }}
            >
              {keys.map((k) => {
                const hex = String(LIGHT[k]);
                const step = k.split('-').pop();
                const onDark = contrast(hex, '#ffffff') > contrast(hex, '#111418');
                return (
                  <div
                    key={k}
                    title={`var(${cssVar(k)})`}
                    style={{
                      background: hex,
                      color: onDark ? '#fff' : '#111418',
                      borderRadius: 6,
                      padding: '28px 6px 6px',
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)',
                      ...mono,
                      fontSize: 11,
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{step}</div>
                    <div style={{ opacity: 0.85 }}>{hex}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Swatch({ color, bg }: { color: string; bg?: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 36,
        height: 24,
        borderRadius: 4,
        background: bg ?? color,
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.12)',
        verticalAlign: 'middle',
      }}
    />
  );
}

export interface SemanticRow {
  token: string;
  usage: string;
  /** 대비를 계산할 배경 토큰 (전경색일 때) */
  on?: string;
}

/** 시맨틱 색상 표: light/dark 값과 (전경색이면) 대비를 함께 보여준다. */
export function SemanticColors({ rows }: { rows: SemanticRow[] }) {
  return (
    <Table head={['토큰', 'Light', 'Dark', '용도']}>
      {rows.map(({ token, usage, on }) => {
        const key = `color-${token}`;
        const l = String(LIGHT[key]);
        const d = String(DARK[key]);
        return (
          <tr key={token}>
            <td style={td}>
              <Code>{cssVar(key)}</Code>
            </td>
            {[
              [l, LIGHT],
              [d, DARK],
            ].map(([value, theme], i) => {
              const bg = on ? String((theme as Tokens)[`color-${on}`]) : undefined;
              return (
                <td key={i} style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <Swatch color={value as string} />
                    <span style={{ ...mono, ...muted }}>{value as string}</span>
                    {bg && !String(value).match(/^#[0-9a-f]{8}$/i) && (
                      <ContrastBadge ratio={contrast(value as string, bg)} />
                    )}
                  </div>
                </td>
              );
            })}
            <td style={{ ...td, ...muted }}>
              {usage}
              {on && <div style={{ ...mono, marginTop: 2 }}>대비 기준 배경: {on}</div>}
            </td>
          </tr>
        );
      })}
    </Table>
  );
}

/* ── Typography ────────────────────────────── */
export function TypeScale() {
  return (
    <Table head={['토큰', '크기', '예시']}>
      {keysWith('font-size-').map((k) => (
        <tr key={k}>
          <td style={td}>
            <Code>{cssVar(k)}</Code>
          </td>
          <td style={{ ...td, ...mono, ...muted }}>
            {String(LIGHT[k])} · {parseFloat(String(LIGHT[k])) * 16}px
          </td>
          <td
            style={{
              ...td,
              fontSize: `var(${cssVar(k)})`,
              lineHeight: 1.3,
              fontFamily: 'var(--hds-font-family-sans)',
            }}
          >
            다람쥐 헌 쳇바퀴에 타고파 Aa
          </td>
        </tr>
      ))}
    </Table>
  );
}

export function FontWeights() {
  return (
    <Table head={['토큰', '값', '예시']}>
      {keysWith('font-weight-').map((k) => (
        <tr key={k}>
          <td style={td}>
            <Code>{cssVar(k)}</Code>
          </td>
          <td style={{ ...td, ...mono, ...muted }}>{String(LIGHT[k])}</td>
          <td
            style={{
              ...td,
              fontWeight: Number(LIGHT[k]),
              fontSize: 18,
              fontFamily: 'var(--hds-font-family-sans)',
            }}
          >
            디자인 시스템 Design System
          </td>
        </tr>
      ))}
    </Table>
  );
}

export function LineHeights() {
  return (
    <div
      className="not-content"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
      }}
    >
      {keysWith('font-line-height-').map((k) => (
        <div
          key={k}
          style={{ border: '1px solid var(--sl-color-gray-5)', borderRadius: 8, padding: 16 }}
        >
          <Code>{cssVar(k)}</Code> <span style={{ ...mono, ...muted }}>{String(LIGHT[k])}</span>
          <p
            style={{
              margin: '8px 0 0',
              lineHeight: Number(LIGHT[k]),
              fontSize: 14,
              wordBreak: 'keep-all',
              fontFamily: 'var(--hds-font-family-sans)',
            }}
          >
            한글은 받침과 모음 구조 때문에 라틴 문자보다 조금 더 넉넉한 행간이 읽기 편하다. 본문에는
            normal 이나 relaxed 를 쓴다.
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── Spacing ───────────────────────────────── */
export function SpacingScale() {
  return (
    <Table head={['토큰', '값', '']}>
      {keysWith('space-').map((k) => (
        <tr key={k}>
          <td style={td}>
            <Code>{cssVar(k)}</Code>
          </td>
          <td style={{ ...td, ...mono, ...muted }}>
            {String(LIGHT[k])} · {parseFloat(String(LIGHT[k])) * 16}px
          </td>
          <td style={{ ...td, width: '55%' }}>
            <div
              style={{
                height: 16,
                width: `var(${cssVar(k)})`,
                background: 'var(--hds-color-accent-solid)',
                borderRadius: 2,
              }}
            />
          </td>
        </tr>
      ))}
    </Table>
  );
}

export function ControlSizes() {
  return (
    <Table head={['토큰', '값', '']}>
      {keysWith('size-control-').map((k) => (
        <tr key={k}>
          <td style={td}>
            <Code>{cssVar(k)}</Code>
          </td>
          <td style={{ ...td, ...mono, ...muted }}>
            {String(LIGHT[k])} · {parseFloat(String(LIGHT[k])) * 16}px
          </td>
          <td style={td}>
            <div
              style={{
                height: `var(${cssVar(k)})`,
                width: 120,
                border: '1px dashed var(--hds-color-accent-solid)',
                borderRadius: 6,
                background: 'var(--hds-color-accent-subtle)',
              }}
            />
          </td>
        </tr>
      ))}
    </Table>
  );
}

/* ── Radius & Shadow ───────────────────────── */
const tile: CSSProperties = {
  width: 112,
  height: 80,
  background: 'var(--hds-color-bg-raised)',
  border: '1px solid var(--sl-color-gray-5)',
  display: 'flex',
  alignItems: 'flex-end',
  padding: 8,
};

export function RadiusScale() {
  return (
    <div className="not-content" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {keysWith('radius-').map((k) => (
        <div
          key={k}
          style={{
            ...tile,
            borderRadius: `var(${cssVar(k)})`,
            background: 'var(--hds-color-accent-subtle)',
            borderColor: 'var(--hds-color-accent-solid)',
          }}
        >
          <span style={mono}>
            {k.replace('radius-', '')}
            <br />
            <span style={muted}>{String(LIGHT[k])}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export function ShadowScale() {
  return (
    <div
      className="not-content"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 32,
        padding: 16,
        background: 'var(--hds-color-bg-subtle)',
        borderRadius: 8,
      }}
    >
      {keysWith('shadow-').map((k) => (
        <div
          key={k}
          style={{
            ...tile,
            width: 160,
            border: 'none',
            borderRadius: 8,
            boxShadow: `var(${cssVar(k)})`,
          }}
        >
          <span style={mono}>
            <Code>{cssVar(k)}</Code>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Motion ────────────────────────────────── */
export function MotionTokens() {
  const durations = keysWith('duration-');
  const easings = keysWith('easing-');
  return (
    <>
      <style>{`
        .hds-docs-motion-track { position: relative; height: 32px; background: var(--hds-color-bg-muted); border-radius: 6px; }
        .hds-docs-motion-dot { position: absolute; top: 4px; left: 4px; width: 24px; height: 24px; border-radius: 50%; background: var(--hds-color-accent-solid); transition-property: left; }
        .hds-docs-motion:hover .hds-docs-motion-dot, .hds-docs-motion:focus-within .hds-docs-motion-dot { left: calc(100% - 28px); }
        @media (prefers-reduced-motion: reduce) { .hds-docs-motion-dot { transition-duration: 0s !important; } }
      `}</style>
      <p style={muted}>
        표 위에 마우스를 올리면 각 토큰으로 움직임을 재생한다. (동작 줄이기 설정이면 즉시 이동)
      </p>
      <div className="hds-docs-motion">
        <Table head={['토큰', '값', '미리보기']}>
          {[...durations, ...easings].map((k) => {
            const isDuration = k.startsWith('duration');
            return (
              <tr key={k}>
                <td style={td}>
                  <Code>{cssVar(k)}</Code>
                </td>
                <td style={{ ...td, ...mono, ...muted }}>{String(LIGHT[k])}</td>
                <td style={{ ...td, width: '45%' }}>
                  <div className="hds-docs-motion-track">
                    <div
                      className="hds-docs-motion-dot"
                      style={{
                        transitionDuration: isDuration ? `var(${cssVar(k)})` : '600ms',
                        transitionTimingFunction: isDuration
                          ? 'var(--hds-easing-standard)'
                          : `var(${cssVar(k)})`,
                      }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      </div>
    </>
  );
}

/* ── Z-index ───────────────────────────────── */
const Z_USAGE: Record<string, string> = {
  dropdown: 'Select · DropdownMenu 목록',
  sticky: '고정 헤더 · 고정 열',
  overlay: '모달 뒤 스크림',
  modal: 'Dialog · AlertDialog',
  popover: 'Popover (모달 위에서도 열릴 수 있음)',
  toast: 'Toast 뷰포트',
  tooltip: 'Tooltip (항상 최상단)',
};

export function ZIndexScale() {
  return (
    <Table head={['토큰', '값', '용도']}>
      {keysWith('z-index-').map((k) => (
        <tr key={k}>
          <td style={td}>
            <Code>{cssVar(k)}</Code>
          </td>
          <td style={{ ...td, ...mono, ...muted }}>{String(LIGHT[k])}</td>
          <td style={{ ...td, ...muted }}>{Z_USAGE[k.replace('z-index-', '')] ?? ''}</td>
        </tr>
      ))}
    </Table>
  );
}
