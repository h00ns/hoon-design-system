import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Checkbox, Table } from '@hoon-ds/react';
import type { TableSortDirection } from '@hoon-ds/react';
import { useState } from 'react';

const ORDERS = [
  { id: 'A-1042', customer: '김하늘', status: '배송 중', amount: 48000 },
  { id: 'A-1043', customer: '이도윤', status: '결제 완료', amount: 129000 },
  { id: 'A-1044', customer: '박서연', status: '배송 완료', amount: 15500 },
  { id: 'A-1045', customer: '최지호', status: '취소', amount: 72000 },
];

const won = (n: number) => `${n.toLocaleString('ko-KR')}원`;

const meta = {
  title: 'Components/Table',
  component: Table.Root,
  args: { density: 'default', striped: false, stickyHeader: false },
  argTypes: {
    density: { control: 'inline-radio', options: ['default', 'compact'] },
  },
} satisfies Meta<typeof Table.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Table.Root {...args} style={{ minWidth: 480 }}>
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
        {ORDERS.map((o) => (
          <Table.Row key={o.id}>
            <Table.Cell>{o.id}</Table.Cell>
            <Table.Cell>{o.customer}</Table.Cell>
            <Table.Cell>
              <Badge size="sm">{o.status}</Badge>
            </Table.Cell>
            <Table.Cell numeric>{won(o.amount)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
};

export const Sortable: Story = {
  render: function SortableStory() {
    const [dir, setDir] = useState<TableSortDirection>('none');
    const rows = [...ORDERS].sort((a, b) =>
      dir === 'none' ? 0 : dir === 'ascending' ? a.amount - b.amount : b.amount - a.amount,
    );
    return (
      <Table.Root style={{ minWidth: 360 }}>
        <Table.Caption>주문 금액</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head>고객</Table.Head>
            <Table.Head
              numeric
              sortDirection={dir}
              onSort={() => setDir(dir === 'ascending' ? 'descending' : 'ascending')}
            >
              금액
            </Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((o) => (
            <Table.Row key={o.id}>
              <Table.Cell>{o.customer}</Table.Cell>
              <Table.Cell numeric>{won(o.amount)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    );
  },
};

export const Selectable: Story = {
  render: function SelectableStory() {
    const [selected, setSelected] = useState<string[]>([]);
    const toggle = (id: string) =>
      setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    return (
      <Table.Root style={{ minWidth: 360 }}>
        <Table.Caption visuallyHidden>주문 선택</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head style={{ width: 48 }}>
              <Checkbox
                aria-label="전체 선택"
                checked={
                  selected.length === ORDERS.length
                    ? true
                    : selected.length > 0
                      ? 'indeterminate'
                      : false
                }
                onCheckedChange={(c) => setSelected(c === true ? ORDERS.map((o) => o.id) : [])}
              />
            </Table.Head>
            <Table.Head>고객</Table.Head>
            <Table.Head numeric>금액</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {ORDERS.map((o) => (
            <Table.Row key={o.id} selected={selected.includes(o.id)}>
              <Table.Cell>
                <Checkbox
                  aria-label={`${o.customer} 주문 선택`}
                  checked={selected.includes(o.id)}
                  onCheckedChange={() => toggle(o.id)}
                />
              </Table.Cell>
              <Table.Cell>{o.customer}</Table.Cell>
              <Table.Cell numeric>{won(o.amount)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    );
  },
};

export const StickyHeader: Story = {
  render: () => (
    <Table.Root
      stickyHeader
      striped
      density="compact"
      containerProps={{ style: { maxHeight: 220 } }}
    >
      <Table.Caption>월별 방문자</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>월</Table.Head>
          <Table.Head numeric>방문자</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Array.from({ length: 12 }, (_, i) => (
          <Table.Row key={i}>
            <Table.Cell>{i + 1}월</Table.Cell>
            <Table.Cell numeric>{(1200 + i * 173).toLocaleString('ko-KR')}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  ),
};
