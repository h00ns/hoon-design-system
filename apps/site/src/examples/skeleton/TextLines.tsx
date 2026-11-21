import { Skeleton } from '@hoon-ds/react';

export default function TextLinesExample() {
  return (
    <div style={{ width: '100%', maxWidth: 360, fontSize: 'var(--hds-font-size-md)' }}>
      {/* 제목 줄: 실제 제목과 같은 글자 크기를 주면 높이가 맞는다 */}
      <Skeleton shape="text" width="40%" style={{ fontSize: 'var(--hds-font-size-xl)' }} />
      <Skeleton shape="text" lines={4} />
    </div>
  );
}
