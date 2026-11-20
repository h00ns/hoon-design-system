import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect, type ReactNode } from 'react';

import '@hoon-ds/tokens/css';
import '@hoon-ds/css/base.css';
import '@hoon-ds/css';

type Theme = 'light' | 'dark' | 'system';

function ThemeRoot({ theme, children }: { theme: Theme; children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
  }, [theme]);
  return children;
}

const withTheme: Decorator = (Story, context) => (
  <ThemeRoot theme={context.globals.theme as Theme}>
    {context.viewMode === 'docs' ? (
      // 문서 페이지의 예시 영역도 현재 테마 배경으로 그린다
      <div
        style={{
          padding: 24,
          borderRadius: 8,
          background: 'var(--hds-color-bg-default)',
          color: 'var(--hds-color-fg-default)',
        }}
      >
        <Story />
      </div>
    ) : (
      <Story />
    )}
  </ThemeRoot>
);

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: '색상 테마',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'system', title: '시스템 설정 따름' },
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    layout: 'centered',
    options: {
      storySort: {
        order: [
          '시작하기',
          ['소개', '설치', '테마', '접근성 원칙'],
          'Foundations',
          ['Colors', 'Typography', 'Spacing', 'Radius & Shadow', 'Motion', 'Z-index'],
          'Components',
        ],
      },
    },
    controls: { expanded: true },
    a11y: {
      // 접근성 위반을 경고가 아니라 실패로 취급한다
      test: 'error',
    },
  },
};

export default preview;
