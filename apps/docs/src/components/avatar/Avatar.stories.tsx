import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '@hoon-ds/react';
import type { AvatarSize } from '@hoon-ds/react';

const SIZES: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

// 오프라인에서도 보이도록 인라인 SVG 를 사진 대신 쓴다
const PHOTO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8dafff"/><stop offset="1" stop-color="#2a50db"/></linearGradient></defs><rect width="80" height="80" fill="url(#g)"/><circle cx="40" cy="32" r="14" fill="#eef3ff"/><path d="M14 80a26 26 0 0 1 52 0Z" fill="#eef3ff"/></svg>`,
  );

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  args: { name: '홍길동', size: 'md', shape: 'circle' },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    src: { control: 'text' },
    alt: { control: 'text' },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithImage: Story = {
  args: { src: PHOTO, name: '홍길동' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {SIZES.map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Initials: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar name="홍길동" />
      <Avatar name="남궁민수" />
      <Avatar name="이산" />
      <Avatar name="Jane Doe" />
      <Avatar name="hoon" />
      <Avatar />
    </div>
  ),
};

export const BrokenImage: Story = {
  args: { src: '/does-not-exist.png', name: '김철수' },
};

export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar name="홍길동" />
      <Avatar name="디자인팀" shape="square" fallback="DS" />
    </div>
  ),
};

export const NextToName: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {/* 옆에 이름이 텍스트로 있으므로 아바타는 장식(alt="") */}
      <Avatar src={PHOTO} name="홍길동" alt="" />
      <div>
        <div style={{ fontWeight: 600 }}>홍길동</div>
        <div style={{ color: 'var(--hds-color-fg-muted)', fontSize: 14 }}>프론트엔드 엔지니어</div>
      </div>
    </div>
  ),
};
