import { Separator } from '@hoon-ds/react';

export default function BasicExample() {
  return (
    <div style={{ width: '100%', maxWidth: 320, display: 'grid', gap: 12 }}>
      <div>
        <strong>hoon-design-system</strong>
        <p style={{ margin: '4px 0 0', color: 'var(--hds-color-fg-muted)' }}>
          접근성을 기본값으로 갖춘 디자인 시스템
        </p>
      </div>
      <Separator />
      <p style={{ margin: 0 }}>버전 0.0.0</p>
    </div>
  );
}
