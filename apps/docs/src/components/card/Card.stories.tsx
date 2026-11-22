import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Button, Card } from '@hoon-ds/react';

const meta = {
  title: 'Components/Card',
  component: Card.Root,
  args: { variant: 'outline', padding: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outline', 'elevated', 'subtle'] },
    padding: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Card.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Card.Root {...args} style={{ width: 320 }}>
      <Card.Header>
        <Card.Title>Pro 요금제</Card.Title>
        <Card.Description>팀 단위로 쓰는 모든 기능</Card.Description>
      </Card.Header>
      <Card.Body>월 29,000원부터. 언제든 해지할 수 있습니다.</Card.Body>
      <Card.Footer>
        <Button>시작하기</Button>
        <Button variant="ghost">자세히</Button>
      </Card.Footer>
    </Card.Root>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {(['outline', 'elevated', 'subtle'] as const).map((variant) => (
        <Card.Root key={variant} variant={variant} style={{ width: 220 }}>
          <Card.Title>{variant}</Card.Title>
          <Card.Description>카드 표면 스타일</Card.Description>
        </Card.Root>
      ))}
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card.Root interactive style={{ width: 340 }}>
      <Card.Header>
        <Badge tone="accent">가이드</Badge>
        <Card.Title>
          <Card.Link href="#post">배포 전 접근성 체크리스트</Card.Link>
        </Card.Title>
        <Card.Description>키보드, 스크린리더, 대비를 10분 안에 확인하는 방법</Card.Description>
      </Card.Header>
      <Card.Footer>
        <Button size="sm" variant="secondary">
          나중에 읽기
        </Button>
      </Card.Footer>
    </Card.Root>
  ),
};
