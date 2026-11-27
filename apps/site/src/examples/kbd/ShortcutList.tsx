import { Kbd } from '@hoon-ds/react';

const SHORTCUTS = [
  { action: '검색 열기', keys: ['⌘', 'K'] },
  { action: '다음 항목', keys: ['↓'] },
  { action: '선택', keys: ['↵'] },
  { action: '닫기', keys: ['Esc'] },
];

export default function ShortcutListExample() {
  return (
    <dl
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '8px 24px',
        alignItems: 'center',
        width: '100%',
        maxWidth: 280,
        margin: 0,
      }}
    >
      {SHORTCUTS.map((s) => (
        <div key={s.action} style={{ display: 'contents' }}>
          <dt>{s.action}</dt>
          <dd style={{ margin: 0 }}>
            <Kbd keys={s.keys} size="sm" />
          </dd>
        </div>
      ))}
    </dl>
  );
}
