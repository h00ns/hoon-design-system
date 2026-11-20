import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const fromRoot = (path: string) => fileURLToPath(new URL(`../../../${path}`, import.meta.url));

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    {
      name: '@storybook/addon-docs',
      // MDX 에서 표·체크리스트 등 GitHub 마크다운 문법을 쓰기 위해
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    '@storybook/addon-a11y',
  ],
  viteFinal: async (viteConfig) => {
    // 빌드 없이 소스를 바로 보며 개발할 수 있도록 패키지를 src 로 연결한다
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      '@hoon-ds/react': fromRoot('packages/react/src/index.ts'),
      '@hoon-ds/css/base.css': fromRoot('packages/css/src/base.css'),
      '@hoon-ds/css': fromRoot('packages/css/src/index.css'),
    };
    // Radix 의 'use client' 지시문은 SPA 번들에서 의미가 없어 생기는 경고이므로 걸러낸다
    viteConfig.build ??= {};
    viteConfig.build.rolldownOptions = {
      ...viteConfig.build.rolldownOptions,
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
    };
    return viteConfig;
  },
};

export default config;
