import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, Button } from '@hoon-ds/react';
import type { AlertTone } from '@hoon-ds/react';
import { useState } from 'react';

const TONES: AlertTone[] = ['info', 'success', 'warning', 'danger'];

const meta = {
  title: 'Components/Alert',
  component: Alert,
  args: {
    tone: 'info',
    title: '정기 점검 안내',
    children: '11월 22일 02:00–04:00 동안 일부 기능을 사용할 수 없습니다.',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: TONES },
    live: { control: 'inline-radio', options: ['off', 'polite', 'assertive'] },
    title: { control: 'text' },
    children: { control: 'text' },
    toneLabel: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(560px, 100%)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const SAMPLES: Record<AlertTone, { title: string; body: string }> = {
  info: {
    title: '정기 점검 안내',
    body: '11월 22일 02:00–04:00 동안 일부 기능을 사용할 수 없습니다.',
  },
  success: { title: '결제가 완료되었습니다', body: '영수증을 메일로 보냈습니다.' },
  warning: {
    title: '저장 공간이 부족합니다',
    body: '사용량이 90%를 넘었습니다. 오래된 파일을 정리해 주세요.',
  },
  danger: {
    title: '결제에 실패했습니다',
    body: '카드 한도를 확인하거나 다른 결제 수단을 선택해 주세요.',
  },
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {TONES.map((tone) => (
        <Alert key={tone} tone={tone} title={SAMPLES[tone].title}>
          {SAMPLES[tone].body}
        </Alert>
      ))}
    </div>
  ),
};

export const TitleOrDescriptionOnly: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Alert tone="success" title="변경 사항을 저장했습니다" />
      <Alert tone="warning">이 문서는 다른 사람이 편집 중입니다.</Alert>
    </div>
  ),
};

export const WithActions: Story = {
  args: {
    tone: 'warning',
    title: '새 버전이 있습니다',
    children: '업데이트하면 최신 기능과 보안 패치가 적용됩니다.',
    actions: (
      <>
        <Button size="sm" variant="ghost">
          나중에
        </Button>
        <Button size="sm">업데이트</Button>
      </>
    ),
  },
};

export const Dismissible: Story = {
  render: function DismissibleStory(args) {
    const [open, setOpen] = useState(true);
    return open ? (
      <Alert {...args} onClose={() => setOpen(false)} />
    ) : (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        안내 다시 보기
      </Button>
    );
  },
};

export const LiveAssertive: Story = {
  render: function LiveStory() {
    const [error, setError] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <Button variant="danger" onClick={() => setError(true)}>
          저장 (실패 재현)
        </Button>
        {error && (
          <Alert
            tone="danger"
            live="assertive"
            title="저장하지 못했습니다"
            onClose={() => setError(false)}
          >
            네트워크 연결을 확인한 뒤 다시 시도해 주세요.
          </Alert>
        )}
      </div>
    );
  },
};
