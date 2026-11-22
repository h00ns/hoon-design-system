import { ScrollArea } from '@hoon-ds/react';

const PRODUCTS = Array.from({ length: 12 }, (_, i) => `상품 ${i + 1}`);

export default function HorizontalExample() {
  return (
    <ScrollArea
      orientation="horizontal"
      type="auto"
      aria-label="최근 본 상품"
      style={{
        width: '100%',
        maxWidth: 400,
        border: '1px solid var(--hds-color-border-default)',
        borderRadius: 8,
      }}
    >
      <ul style={{ display: 'flex', gap: 12, margin: 0, padding: 12, listStyle: 'none' }}>
        {PRODUCTS.map((name) => (
          <li
            key={name}
            style={{
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              width: 96,
              height: 96,
              borderRadius: 8,
              background: 'var(--hds-color-bg-muted)',
            }}
          >
            {name}
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
