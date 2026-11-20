// src/*.css 의 @import 를 하나로 묶고, 지원 브라우저에 맞게 변환·압축한다.
import { mkdir, writeFile } from 'node:fs/promises';
import { browserslistToTargets, bundle } from 'lightningcss';
import browserslist from 'browserslist';

const targets = browserslistToTargets(
  browserslist([
    'last 2 Chrome versions',
    'last 2 Firefox versions',
    'last 2 Safari major versions',
    'iOS >= 16',
  ]),
);

await mkdir('dist', { recursive: true });

for (const entry of ['index', 'base']) {
  const { code, map } = bundle({
    filename: `src/${entry}.css`,
    minify: true,
    sourceMap: true,
    targets,
  });
  await writeFile(`dist/${entry}.css`, `${code}\n/*# sourceMappingURL=${entry}.css.map */`);
  await writeFile(`dist/${entry}.css.map`, map);
}
