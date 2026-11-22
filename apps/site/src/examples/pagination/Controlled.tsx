import { Pagination } from '@hoon-ds/react';
import { useState } from 'react';

const PAGE_SIZE = 10;
const TOTAL = 137;

export default function ControlledExample() {
  const [page, setPage] = useState(1);
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, TOTAL);

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
      <p style={{ margin: 0 }}>
        전체 {TOTAL}건 중 {from}~{to}번째
      </p>
      <Pagination count={Math.ceil(TOTAL / PAGE_SIZE)} page={page} onPageChange={setPage} />
    </div>
  );
}
