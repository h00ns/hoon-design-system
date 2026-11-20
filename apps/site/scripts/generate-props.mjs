// @hoon-ds/react 소스의 TypeScript 타입에서 Props 표 데이터를 뽑는다.
// → src/generated/props.json  ({ [displayName]: Prop[] })
// 우리 소스에 선언된 props 만 남긴다 (HTML 속성·Radix 가 제공하는 props 는 문서에서 링크로 안내).
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { basename, join, sep } from 'node:path';
import docgen from 'react-docgen-typescript';

const root = fileURLToPath(new URL('../../../packages/react/', import.meta.url));
const srcDir = join(root, 'src');

async function componentFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await componentFiles(full)));
    else if (/^[A-Z].*\.tsx$/.test(entry.name) && !entry.name.includes('.test.')) out.push(full);
  }
  return out;
}

const parser = docgen.withCustomConfig(join(root, 'tsconfig.json'), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => {
    const files = prop.declarations?.map((d) => d.fileName) ?? [];
    return files.some(
      (f) =>
        f.includes(`${sep}packages${sep}react${sep}src${sep}`) ||
        f.includes('/packages/react/src/'),
    );
  },
});

const files = await componentFiles(srcDir);
const typeOf = (t) => {
  if (t.name === 'enum' && Array.isArray(t.value)) return t.value.map((v) => v.value).join(' | ');
  return t.raw && t.raw.length < 120 ? t.raw : t.name;
};

// 키: 단일 컴포넌트는 'Button', 네임스페이스 부품은 'Dialog.Content'
const keyOf = (doc) => {
  const file = basename(doc.filePath, '.tsx');
  return doc.displayName === file ? file : `${file}.${doc.displayName}`;
};

const result = {};
for (const doc of parser.parse(files)) {
  const props = Object.values(doc.props)
    .map((p) => ({
      name: p.name,
      type: typeOf(p.type),
      required: p.required,
      defaultValue: p.defaultValue?.value ?? null,
      description: p.description.replace(/\n@default.*$/s, '').trim(),
    }))
    .sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name));
  if (props.length) result[keyOf(doc)] = props;
}

await mkdir(new URL('../src/generated/', import.meta.url), { recursive: true });
await writeFile(
  new URL('../src/generated/props.json', import.meta.url),
  `${JSON.stringify(result, null, 2)}\n`,
);
console.log(`props: ${Object.keys(result).length} components → src/generated/props.json`);
