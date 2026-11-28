import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/meta.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  platform: 'neutral',
  // 훅은 서버 컴포넌트에서도 쓸 수 있는 useId 뿐이라 'use client' 경계를 두지 않는다
});
