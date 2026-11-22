import { Table } from '@hoon-ds/react';

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  month: `${i + 1}월`,
  visitors: 1200 + i * 173,
  signups: 48 + ((i * 37) % 90),
}));

export default function StickyHeaderExample() {
  return (
    <Table.Root
      stickyHeader
      striped
      density="compact"
      // 세로 스크롤이 생기도록 높이를 제한한다. 넘치면 키보드로 포커스해 스크롤할 수 있다.
      containerProps={{ style: { maxHeight: 240, width: '100%', maxWidth: 420 } }}
    >
      <Table.Caption>2026년 월별 방문자</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>월</Table.Head>
          <Table.Head numeric>방문자</Table.Head>
          <Table.Head numeric>가입</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {MONTHS.map((row) => (
          <Table.Row key={row.month}>
            <Table.Cell>{row.month}</Table.Cell>
            <Table.Cell numeric>{row.visitors.toLocaleString('ko-KR')}</Table.Cell>
            <Table.Cell numeric>{row.signups}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
