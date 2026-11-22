import { Pagination } from '@hoon-ds/react';

export default function RangeExample() {
  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'center' }}>
      <Pagination count={50} defaultPage={25} size="sm" aria-label="페이지 이동 (기본 범위)" />
      <Pagination
        count={50}
        defaultPage={25}
        size="sm"
        siblingCount={2}
        boundaryCount={2}
        aria-label="페이지 이동 (넓은 범위)"
      />
    </div>
  );
}
