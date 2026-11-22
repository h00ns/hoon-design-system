import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from '@hoon-ds/react';

const meta = {
  title: 'Components/Link',
  component: Link,
  args: { href: '#docs', children: '문서 보기', variant: 'default', underline: 'always' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'subtle'] },
    underline: { control: 'inline-radio', options: ['always', 'hover'] },
    external: { control: 'boolean' },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const InSentence: Story = {
  render: () => (
    <p style={{ maxWidth: 420, margin: 0 }}>
      설치 방법은 <Link href="#install">시작하기</Link>를, 브라우저 지원 현황은{' '}
      <Link href="https://caniuse.com" external>
        Can I use
      </Link>
      를 참고하세요.
    </p>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <Link href="#a">default</Link>
      <Link href="#b" variant="subtle">
        subtle
      </Link>
      <Link href="#c" underline="hover">
        underline hover
      </Link>
    </div>
  ),
};
