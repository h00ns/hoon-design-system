/**
 * manifest.mjs 의 목록으로 아이콘 소스를 만든다.
 *  - src/generated/icons.ts : React 컴포넌트 (트리 셰이킹 가능한 개별 export)
 *  - src/generated/meta.ts  : 이름·분류·검색어 메타데이터
 *  - svg/*.svg              : 프레임워크 없이 쓰는 원본 SVG
 *
 * 원본: Phosphor Icons (MIT) https://phosphoricons.com
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORIES, ICONS } from './manifest.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// exports 에 package.json 이 없어 node_modules 경로로 직접 찾는다
const assets = join(root, 'node_modules/@phosphor-icons/core/assets');
const WEIGHTS = ['regular', 'bold', 'fill'];

const pascal = (s) => s.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
const readPath = (source, weight) => {
  const file = join(assets, weight, `${source}${weight === 'regular' ? '' : `-${weight}`}.svg`);
  const svg = readFileSync(file, 'utf8');
  const paths = [...svg.matchAll(/<path d="([^"]+)"\s*\/>/g)];
  if (paths.length !== 1)
    throw new Error(`${file}: path 가 정확히 1개여야 한다 (${paths.length}개)`);
  return paths[0][1];
};

const names = new Set();
const icons = ICONS.map((icon) => {
  if (names.has(icon.name)) throw new Error(`이름 중복: ${icon.name}`);
  names.add(icon.name);
  if (!CATEGORIES[icon.category]) throw new Error(`알 수 없는 분류: ${icon.category}`);
  return {
    ...icon,
    component: `${pascal(icon.name)}Icon`,
    d: Object.fromEntries(WEIGHTS.map((w) => [w, readPath(icon.source, w)])),
  };
});

const header =
  '// 자동 생성 파일: 직접 고치지 말고 scripts/manifest.mjs 를 고친 뒤 `pnpm generate` 를 실행한다.\n';

mkdirSync(join(root, 'src/generated'), { recursive: true });
writeFileSync(
  join(root, 'src/generated/icons.ts'),
  header +
    "import { createIcon } from '../create-icon';\n\n" +
    icons
      .map(
        (i) =>
          `/** ${i.tags.join(' · ')} */\nexport const ${i.component} = /* @__PURE__ */ createIcon(${JSON.stringify(
            i.component,
          )}, ${JSON.stringify(i.name)}, ${JSON.stringify(i.d)});\n`,
      )
      .join('\n'),
);

writeFileSync(
  join(root, 'src/generated/meta.ts'),
  header +
    `export const ICON_CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)} as const;\n\n` +
    'export type IconCategory = keyof typeof ICON_CATEGORIES;\n\n' +
    'export interface IconMeta {\n  /** kebab-case 이름. SVG 파일 이름이기도 하다 */\n  name: string;\n  /** React 컴포넌트 이름 */\n  component: string;\n  category: IconCategory;\n  /** 검색어 (한국어·영어) */\n  tags: readonly string[];\n}\n\n' +
    `export const ICON_META: readonly IconMeta[] = ${JSON.stringify(
      icons.map(({ name, component, category, tags }) => ({ name, component, category, tags })),
      null,
      2,
    )};\n`,
);

rmSync(join(root, 'svg'), { recursive: true, force: true });
mkdirSync(join(root, 'svg'));
for (const i of icons) {
  for (const w of WEIGHTS) {
    writeFileSync(
      join(root, 'svg', `${i.name}${w === 'regular' ? '' : `-${w}`}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24" fill="currentColor"><path d="${i.d[w]}"/></svg>\n`,
    );
  }
}

console.log(`아이콘 ${icons.length}개 × ${WEIGHTS.length}가지 굵기를 생성했다.`);
