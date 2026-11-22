import { Button, Checkbox, Table } from '@hoon-ds/react';
import { useState } from 'react';

const MEMBERS = [
  { id: 'm1', name: '김하늘', role: '관리자' },
  { id: 'm2', name: '이도윤', role: '편집자' },
  { id: 'm3', name: '박서연', role: '뷰어' },
];

export default function SelectableExample() {
  const [selected, setSelected] = useState<string[]>([]);
  const allChecked =
    selected.length === MEMBERS.length ? true : selected.length > 0 ? 'indeterminate' : false;

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 440 }}>
      <Table.Root>
        <Table.Caption visuallyHidden>팀원 목록</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head style={{ width: 48 }}>
              <Checkbox
                aria-label="전체 선택"
                checked={allChecked}
                onCheckedChange={(checked) =>
                  setSelected(checked === true ? MEMBERS.map((m) => m.id) : [])
                }
              />
            </Table.Head>
            <Table.Head>이름</Table.Head>
            <Table.Head>권한</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {MEMBERS.map((member) => (
            <Table.Row key={member.id} selected={selected.includes(member.id)}>
              <Table.Cell>
                <Checkbox
                  aria-label={`${member.name} 선택`}
                  checked={selected.includes(member.id)}
                  onCheckedChange={() => toggle(member.id)}
                />
              </Table.Cell>
              <Table.Cell>{member.name}</Table.Cell>
              <Table.Cell>{member.role}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <div>
        <Button variant="danger" size="sm" disabled={selected.length === 0}>
          선택한 {selected.length}명 내보내기
        </Button>
      </div>
    </div>
  );
}
