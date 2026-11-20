import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  platform: 'neutral',
  // Next.js App Router(RSC)에서 바로 import 할 수 있도록 클라이언트 경계를 표시한다
  outputOptions: {
    banner: "'use client';",
  },
});
