// @ts-check
import { fileURLToPath } from 'node:url';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import rehypeBaseLinks from './plugins/rehype-base-links.mjs';

/** @param {string} path */
const fromRoot = (path) => fileURLToPath(new URL(`../../${path}`, import.meta.url));

// GitHub Pages: https://h00ns.github.io/hoon-design-system/
const BASE = '/hoon-design-system';

export default defineConfig({
  site: 'https://h00ns.github.io',
  base: BASE,
  trailingSlash: 'always',
  markdown: {
    rehypePlugins: [[rehypeBaseLinks, { base: BASE }]],
  },
  integrations: [
    starlight({
      title: 'hoon-design-system',
      description: '접근성과 사용성을 기본값으로 갖춘 React 디자인 시스템',
      defaultLocale: 'root',
      locales: { root: { label: '한국어', lang: 'ko' } },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/h00ns/hoon-design-system' },
      ],
      customCss: [
        './src/styles/layer-order.css',
        '@hoon-ds/tokens/css',
        '@hoon-ds/css',
        './src/styles/site.css',
      ],
      sidebar: [
        { label: '시작하기', items: [{ autogenerate: { directory: 'getting-started' } }] },
        { label: 'Foundations', items: [{ autogenerate: { directory: 'foundations' } }] },
        { label: 'Components', items: [{ autogenerate: { directory: 'components' } }] },
      ],
      lastUpdated: false,
      favicon: '/favicon.svg',
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
