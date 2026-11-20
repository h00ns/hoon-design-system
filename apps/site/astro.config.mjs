// @ts-check
import { fileURLToPath } from 'node:url';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

const fromRoot = (path) => fileURLToPath(new URL(`../../${path}`, import.meta.url));

export default defineConfig({
  site: 'https://hoon-design-system.example.com',
  integrations: [
    starlight({
      title: 'hoon-design-system',
      description: '접근성과 사용성을 기본값으로 갖춘 React 디자인 시스템',
      defaultLocale: 'root',
      locales: { root: { label: '한국어', lang: 'ko' } },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/h00ns/hoon-design-system' },
      ],
      customCss: ['@hoon-ds/tokens/css', '@hoon-ds/css', './src/styles/site.css'],
      sidebar: [
        { label: '시작하기', items: [{ autogenerate: { directory: 'getting-started' } }] },
        { label: 'Foundations', items: [{ autogenerate: { directory: 'foundations' } }] },
        { label: 'Components', items: [{ autogenerate: { directory: 'components' } }] },
      ],
      lastUpdated: false,
    }),
    react(),
  ],
  vite: {
    resolve: {
      // 패키지를 빌드하지 않아도 소스 그대로 문서를 개발할 수 있도록 src 로 연결
      alias: {
        '@hoon-ds/react': fromRoot('packages/react/src/index.ts'),
        '@hoon-ds/css': fromRoot('packages/css/src/index.css'),
      },
    },
  },
});
