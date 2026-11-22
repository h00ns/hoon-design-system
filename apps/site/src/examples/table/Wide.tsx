import { Table } from '@hoon-ds/react';

const HEADERS = ['상품 코드', '상품명', '분류', '공급사', '입고일', '재고', '단가', '합계'];

export default function WideExample() {
  return (
    // 표가 컨테이너보다 넓으면 스크롤 영역이 Tab 으로 포커스되고, 화살표 키로 스크롤할 수 있다
    <Table.Root
      style={{ whiteSpace: 'nowrap' }}
      containerProps={{ style: { width: '100%', maxWidth: 420 } }}
    >
      <Table.Caption>입고 내역</Table.Caption>
      <Table.Header>
        <Table.Row>
          {HEADERS.map((h) => (
            <Table.Head key={h} numeric={h === '재고' || h === '단가' || h === '합계'}>
              {h}
            </Table.Head>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>KB-2031</Table.Cell>
          <Table.Cell>무선 키보드</Table.Cell>
          <Table.Cell>주변기기</Table.Cell>
          <Table.Cell>한빛상사</Table.Cell>
          <Table.Cell>2026-11-03</Table.Cell>
          <Table.Cell numeric>32</Table.Cell>
          <Table.Cell numeric>89,000</Table.Cell>
          <Table.Cell numeric>2,848,000</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>HB-0417</Table.Cell>
          <Table.Cell>USB-C 허브</Table.Cell>
          <Table.Cell>주변기기</Table.Cell>
          <Table.Cell>누리전자</Table.Cell>
          <Table.Cell>2026-11-08</Table.Cell>
          <Table.Cell numeric>118</Table.Cell>
          <Table.Cell numeric>35,000</Table.Cell>
          <Table.Cell numeric>4,130,000</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}
