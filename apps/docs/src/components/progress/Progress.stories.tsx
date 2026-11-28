import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Progress } from '@hoon-ds/react';
import { useEffect, useState } from 'react';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  args: { value: 42, label: '파일 업로드', showValue: true, size: 'md', tone: 'accent' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: { control: 'inline-radio', options: ['accent', 'success', 'critical'] },
    getValueLabel: { control: false },
  },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <Progress value={30} size="sm" label="sm" showValue />
      <Progress value={50} size="md" label="md" showValue />
      <Progress value={70} size="lg" label="lg" showValue />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <Progress value={60} label="업로드 중" showValue />
      <Progress value={100} tone="success" label="업로드 완료" showValue />
      <Progress value={35} tone="critical" label="업로드 실패: 용량 초과" showValue />
    </div>
  ),
};

export const Indeterminate: Story = {
  render: () => <Progress value={null} label="서버에 연결하는 중" />,
};

export const CustomValueLabel: Story = {
  render: () => (
    <Progress
      value={3}
      max={5}
      label="설문 진행"
      showValue
      getValueLabel={(value, max) => `${max}단계 중 ${value}단계`}
    />
  ),
};

export const Live: Story = {
  render: function LiveStory() {
    const [value, setValue] = useState(0);
    const [started, setStarted] = useState(false);
    const running = started && value < 100;
    useEffect(() => {
      if (!running) return;
      const id = setInterval(() => setValue((v) => Math.min(v + 5, 100)), 200);
      return () => clearInterval(id);
    }, [running]);
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <Progress
          value={value}
          label={value === 100 ? '업로드 완료' : '업로드'}
          tone={value === 100 ? 'success' : 'accent'}
          showValue
        />
        <Button
          variant="secondary"
          onClick={() => {
            setValue(0);
            setStarted(true);
          }}
        >
          업로드 시작
        </Button>
      </div>
    );
  },
};
