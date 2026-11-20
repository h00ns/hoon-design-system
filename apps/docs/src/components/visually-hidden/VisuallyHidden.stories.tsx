import type { Meta, StoryObj } from '@storybook/react-vite';
import { VisuallyHidden } from '@hoon-ds/react';

const meta = {
  title: 'Components/VisuallyHidden',
  component: VisuallyHidden,
  args: { children: '스크린리더만 읽는 텍스트' },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <p>
      화면에는 이 문장만 보인다.
      <VisuallyHidden {...args} />
    </p>
  ),
};

export const CountContext: Story = {
  name: '숫자에 맥락 더하기',
  render: () => (
    <p style={{ margin: 0 }}>
      장바구니 <strong>3</strong>
      <VisuallyHidden>개 상품</VisuallyHidden>
    </p>
  ),
};

export const SkipLink: Story = {
  name: '본문 바로가기',
  render: () => (
    <div>
      <p style={{ marginTop: 0 }}>Tab 키를 눌러 보세요.</p>
      <VisuallyHidden asChild focusable>
        <a
          href="#main"
          style={{
            padding: '8px 12px',
            background: 'var(--hds-color-bg-inverse)',
            color: 'var(--hds-color-fg-inverse)',
            borderRadius: 6,
          }}
        >
          본문 바로가기
        </a>
      </VisuallyHidden>
    </div>
  ),
};
