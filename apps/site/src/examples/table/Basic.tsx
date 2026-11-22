import { Badge, Table } from '@hoon-ds/react';

const ORDERS = [
  { id: 'A-1042', customer: '김하늘', status: '배송 중', amount: 48000 },
  { id: 'A-1043', customer: '이도윤', status: '결제 완료', amount: 129000 },
  { id: 'A-1044', customer: '박서연', status: '배송 완료', amount: 15500 },
];

export default function BasicExample() {
  return (
    <Table.Root style={{ minWidth: 480 }}>
      <Table.Caption>최근 주문</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>주문 번호</Table.Head>
          <Table.Head>고객</Table.Head>
          <Table.Head>상태</Table.Head>
          <Table.Head numeric>금액</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {ORDERS.map((order) => (
          <Table.Row key={order.id}>
            <Table.Cell>{order.id}</Table.Cell>
            <Table.Cell>{order.customer}</Table.Cell>
            <Table.Cell>
              <Badge size="sm">{order.status}</Badge>
            </Table.Cell>
            <Table.Cell numeric>{order.amount.toLocaleString('ko-KR')}원</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
