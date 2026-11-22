import { ScrollArea } from '@hoon-ds/react';

const ROWS = Array.from({ length: 20 }, (_, i) => i + 1);
const COLS = ['주문 번호', '상품', '수량', '결제 금액', '배송 상태', '도착 예정일'];

export default function BothExample() {
  return (
    <ScrollArea
      orientation="both"
      type="always"
      aria-label="주문 목록"
      style={{
        width: '100%',
        maxWidth: 420,
        height: 220,
        border: '1px solid var(--hds-color-border-default)',
        borderRadius: 8,
      }}
    >
      <table style={{ borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
        <thead>
          <tr>
            {COLS.map((col) => (
              <th key={col} scope="col" style={{ padding: '8px 16px', textAlign: 'start' }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((n) => (
            <tr key={n}>
              <td style={{ padding: '6px 16px' }}>2026-{String(n).padStart(4, '0')}</td>
              <td style={{ padding: '6px 16px' }}>무선 키보드</td>
              <td style={{ padding: '6px 16px' }}>1</td>
              <td style={{ padding: '6px 16px' }}>59,000원</td>
              <td style={{ padding: '6px 16px' }}>배송 중</td>
              <td style={{ padding: '6px 16px' }}>11월 {n}일</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}
