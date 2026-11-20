// 토큰 JSON(DTCG 포맷) → CSS 변수 / JS / JSON
// - :root 에는 primitive + scale + light semantic 전부
// - dark semantic 은 [data-theme="dark"] 와 prefers-color-scheme(사용자가 light 를 강제하지 않은 경우) 두 곳에 출력
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import StyleDictionary from 'style-dictionary';
import { fileHeader, formattedVariables } from 'style-dictionary/utils';

const PREFIX = 'hds';
const BUILD = 'dist/';

await rm(BUILD, { recursive: true, force: true });

StyleDictionary.registerFormat({
  name: 'css/hds-theme',
  format: async ({ dictionary, file, options }) => {
    const header = await fileHeader({ file });
    const vars = formattedVariables({
      format: 'css',
      dictionary,
      outputReferences: true,
      usesDtcg: true,
      formatting: { indentation: '  ' },
    });
    const { theme } = options;
    if (theme === 'light') {
      return `${header}:root {\n  color-scheme: light;\n${vars}\n}\n`;
    }
    const nested = vars.replace(/^/gm, '  ');
    return (
      `${header}[data-theme="dark"] {\n  color-scheme: dark;\n${vars}\n}\n\n` +
      `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="light"]) {\n    color-scheme: dark;\n${nested}\n  }\n}\n`
    );
  },
});

const isSemantic = (token) => token.filePath.includes('/semantic/');

const lightSd = new StyleDictionary({
  source: ['src/primitive/**/*.json', 'src/semantic/light.json'],
  usesDtcg: true,
  log: { verbosity: 'default', warnings: 'error' },
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: PREFIX,
      buildPath: `${BUILD}css/`,
      files: [{ destination: 'light.css', format: 'css/hds-theme', options: { theme: 'light' } }],
    },
    js: {
      transformGroup: 'js',
      buildPath: `${BUILD}js/`,
      files: [
        { destination: 'tokens.js', format: 'javascript/es6' },
        { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' },
      ],
    },
    json: {
      transformGroup: 'css',
      buildPath: `${BUILD}json/`,
      files: [{ destination: 'light.json', format: 'json/flat' }],
    },
  },
});

const darkSd = new StyleDictionary({
  source: ['src/primitive/**/*.json', 'src/semantic/dark.json'],
  usesDtcg: true,
  log: { verbosity: 'default', warnings: 'error' },
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: PREFIX,
      buildPath: `${BUILD}css/`,
      // dark 시맨틱은 :root 에 이미 정의된 primitive 를 var() 로 참조하므로
      // "filtered out token references" 경고는 의도된 것이다. (충돌 검사는 light 빌드가 담당)
      log: { warnings: 'disabled' },
      files: [
        {
          destination: 'dark.css',
          format: 'css/hds-theme',
          filter: isSemantic,
          options: { theme: 'dark' },
        },
      ],
    },
    json: {
      transformGroup: 'css',
      buildPath: `${BUILD}json/`,
      files: [{ destination: 'dark.json', format: 'json/flat' }],
    },
  },
});

await lightSd.buildAllPlatforms();
await darkSd.buildAllPlatforms();

// light + dark 를 하나의 진입 파일로 합친다 (소비자는 @hoon-ds/tokens/css 하나만 import)
const light = await readFile(`${BUILD}css/light.css`, 'utf8');
const dark = await readFile(`${BUILD}css/dark.css`, 'utf8');
await mkdir(`${BUILD}css`, { recursive: true });
await writeFile(`${BUILD}css/tokens.css`, `${light}\n${dark}`);
