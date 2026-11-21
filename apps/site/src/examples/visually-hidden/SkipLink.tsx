import { VisuallyHidden } from '@hoon-ds/react';

export default function SkipLinkExample() {
  return (
    <div>
      <p style={{ marginTop: 0 }}>이 영역을 클릭한 뒤 Tab 키를 눌러 보세요.</p>
      {/* focusable: 키보드 포커스를 받으면 화면에 드러난다 */}
      <VisuallyHidden asChild focusable>
        <a
          href="#main"
          style={{
            padding: '8px 12px',
            background: 'var(--hds-color-bg-inverse)',
            color: 'var(--hds-color-fg-inverse)',
            borderRadius: 6,
          }}
        >
          본문 바로가기
        </a>
      </VisuallyHidden>
    </div>
  );
}
