import type { ReactNode } from 'react';

interface ItemProps {
  title?: string;
  children: ReactNode;
}

const box = (tone: 'do' | 'dont') =>
  ({
    flex: '1 1 260px',
    margin: 0,
    padding: '16px 20px',
    borderRadius: 8,
    borderTop: `4px solid ${tone === 'do' ? '#0b7142' : '#d42a2a'}`,
    background: tone === 'do' ? '#edfcf2' : '#fff1f1',
    color: '#1c2027',
    fontSize: 14,
    lineHeight: 1.6,
  }) as const;

function Item({ tone, title, children }: ItemProps & { tone: 'do' | 'dont' }) {
  return (
    <figure style={box(tone)}>
      <figcaption style={{ fontWeight: 700, marginBottom: 6 }}>
        {tone === 'do' ? '✅ 이렇게' : '❌ 이렇게 하지 않기'}
        {title ? ` — ${title}` : ''}
      </figcaption>
      <div>{children}</div>
    </figure>
  );
}

/** 문서용 Do / Don't 가이드 블록 */
export function DoDont({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, margin: '16px 0' }}>{children}</div>
  );
}

export const Do = (props: ItemProps) => <Item tone="do" {...props} />;
export const Dont = (props: ItemProps) => <Item tone="dont" {...props} />;
