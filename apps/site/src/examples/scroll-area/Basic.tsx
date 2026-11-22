import { ScrollArea } from '@hoon-ds/react';

const TAGS = Array.from({ length: 40 }, (_, i) => `태그 ${i + 1}`);

export default function BasicExample() {
  return (
    <ScrollArea
      aria-label="태그 목록"
      style={{
        width: 240,
        height: 200,
        border: '1px solid var(--hds-color-border-default)',
        borderRadius: 8,
      }}
    >
      <ul style={{ margin: 0, padding: '8px 16px', listStyle: 'none' }}>
        {TAGS.map((tag) => (
          <li key={tag} style={{ padding: '4px 0' }}>
            {tag}
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
