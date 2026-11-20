import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, toast, Toaster } from '@hoon-ds/react';
import type { ToasterProps, ToastTone } from '@hoon-ds/react';
import { useEffect, useState, useSyncExternalStore } from 'react';

/*
 * 문서 페이지에는 여러 스토리가 동시에 렌더링된다.
 * Toaster 는 하나만 있어야 하므로, 먼저 마운트된 스토리의 것만 활성화한다
 * (그 스토리가 사라지면 다음 스토리가 이어받는다).
 */
const owners: symbol[] = [];
const subscribers = new Set<() => void>();
const notify = () => subscribers.forEach((fn) => fn());
const subscribe = (fn: () => void) => {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
};

function StoryToaster(props: ToasterProps) {
  const [id] = useState(() => Symbol('toaster'));
  useEffect(() => {
    owners.push(id);
    notify();
    return () => {
      owners.splice(owners.indexOf(id), 1);
      notify();
    };
  }, [id]);
  const active = useSyncExternalStore(
    subscribe,
    () => owners[0] === id,
    () => false,
  );
  return active ? <Toaster {...props} /> : null;
}

const row = { display: 'flex', gap: 8, flexWrap: 'wrap' } as const;

const meta = {
  title: 'Components/Toast',
  component: Toaster,
  args: { position: 'bottom-right', duration: 5000, limit: 3 },
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
    },
    duration: { control: { type: 'number', step: 1000 } },
    limit: { control: { type: 'number', min: 1, max: 6 } },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <>
      <Button onClick={() => toast({ title: '변경 사항을 저장했습니다', description: '방금 전' })}>
        토스트 띄우기
      </Button>
      <StoryToaster {...args} />
    </>
  ),
};

const TONE_SAMPLES: Array<[ToastTone, string, () => void]> = [
  ['neutral', 'Neutral', () => toast('링크를 복사했습니다')],
  ['info', 'Info', () => toast.info('새 댓글이 2개 있습니다')],
  ['success', 'Success', () => toast.success('결제가 완료되었습니다')],
  ['warning', 'Warning', () => toast.warning('저장 공간이 거의 찼습니다')],
  [
    'danger',
    'Danger',
    () => toast.error('업로드에 실패했습니다', { description: '파일이 10MB를 넘습니다.' }),
  ],
];

export const Tones: Story = {
  render: (args) => (
    <div style={row}>
      {TONE_SAMPLES.map(([tone, label, show]) => (
        <Button key={tone} variant="secondary" onClick={show}>
          {label}
        </Button>
      ))}
      <StoryToaster {...args} />
    </div>
  ),
};

export const WithAction: Story = {
  render: (args) => (
    <>
      <Button
        variant="danger"
        onClick={() =>
          toast({
            title: '메일 1통을 삭제했습니다',
            action: {
              label: '되돌리기',
              altText: '휴지통에서 메일을 되돌릴 수 있습니다',
              onClick: () => toast.success('메일을 되돌렸습니다'),
            },
          })
        }
      >
        메일 삭제
      </Button>
      <StoryToaster {...args} />
    </>
  ),
};

export const UpdateById: Story = {
  render: (args) => (
    <>
      <Button
        onClick={() => {
          toast('업로드 중…', { id: 'upload', duration: Infinity });
          setTimeout(() => toast.success('업로드 완료', { id: 'upload', duration: 4000 }), 1500);
        }}
      >
        파일 업로드
      </Button>
      <StoryToaster {...args} />
    </>
  ),
};

export const Persistent: Story = {
  render: (args) => (
    <div style={row}>
      <Button
        variant="secondary"
        onClick={() =>
          toast.warning('오프라인 상태입니다', {
            id: 'offline',
            description: '연결되면 자동으로 동기화합니다.',
            duration: Infinity,
          })
        }
      >
        닫을 때까지 유지
      </Button>
      <Button variant="ghost" onClick={() => toast.dismiss()}>
        모두 닫기
      </Button>
      <StoryToaster {...args} />
    </div>
  ),
};

export const Stacking: Story = {
  render: (args) => {
    let n = 0;
    return (
      <>
        <Button
          variant="secondary"
          onClick={() => {
            for (let i = 0; i < 5; i += 1) toast(`알림 ${++n}`);
          }}
        >
          5개 한꺼번에 (limit 초과분은 대기)
        </Button>
        <StoryToaster {...args} />
      </>
    );
  },
};
