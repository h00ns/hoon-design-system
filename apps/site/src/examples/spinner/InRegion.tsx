import { Spinner } from '@hoon-ds/react';

export default function InRegionExample() {
  return (
    <section
      aria-busy="true"
      aria-labelledby="orders-title"
      style={{ display: 'grid', gap: 12, justifyItems: 'center', minWidth: 240 }}
    >
      <h3 id="orders-title" style={{ margin: 0, fontSize: 16 }}>
        주문 내역
      </h3>
      <Spinner label="주문 내역을 불러오는 중" />
    </section>
  );
}
