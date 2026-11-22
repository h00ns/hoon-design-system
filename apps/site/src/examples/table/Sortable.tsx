import { Table } from '@hoon-ds/react';
import type { TableSortDirection } from '@hoon-ds/react';
import { useState } from 'react';

const PRODUCTS = [
  { name: '무선 키보드', stock: 32, price: 89000 },
  { name: '모니터 받침대', stock: 4, price: 42000 },
  { name: 'USB-C 허브', stock: 118, price: 35000 },
  { name: '노트북 거치대', stock: 0, price: 56000 },
];

type Column = 'stock' | 'price';

export default function SortableExample() {
  const [sort, setSort] = useState<{ column: Column; direction: TableSortDirection }>({
    column: 'price',
    direction: 'none',
  });

  const toggle = (column: Column) =>
    setSort((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === 'ascending' ? 'descending' : 'ascending',
    }));

  const directionOf = (column: Column): TableSortDirection =>
    sort.column === column ? sort.direction : 'none';

  const rows = [...PRODUCTS].sort((a, b) => {
    if (sort.direction === 'none') return 0;
    const diff = a[sort.column] - b[sort.column];
    return sort.direction === 'ascending' ? diff : -diff;
  });

  return (
    <Table.Root style={{ minWidth: 420 }}>
      <Table.Caption>상품 재고</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>상품</Table.Head>
          <Table.Head numeric sortDirection={directionOf('stock')} onSort={() => toggle('stock')}>
            재고
          </Table.Head>
          <Table.Head numeric sortDirection={directionOf('price')} onSort={() => toggle('price')}>
            가격
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((p) => (
          <Table.Row key={p.name}>
            <Table.Cell>{p.name}</Table.Cell>
            <Table.Cell numeric>{p.stock}</Table.Cell>
            <Table.Cell numeric>{p.price.toLocaleString('ko-KR')}원</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
