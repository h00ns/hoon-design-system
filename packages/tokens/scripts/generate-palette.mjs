// OKLCH 로 색 스케일을 만든다 → src/primitive/color.json
// - 단계별 명도(L)를 고정하고, 채도(C)는 중간 단계에서 가장 높고 양 끝에서 줄어드는 곡선을 쓴다
// - sRGB 범위를 벗어나면 색상(hue)과 명도는 유지한 채 채도만 줄인다
// 실행: node scripts/generate-palette.mjs
import { writeFile } from 'node:fs/promises';

const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

/** 색조 스케일: 밝은 단계는 거의 흰색에 가깝게, 600 부근이 대표색 */
const TONE_L = [0.982, 0.96, 0.92, 0.86, 0.77, 0.67, 0.575, 0.495, 0.415, 0.335, 0.255];
const TONE_C = [0.1, 0.2, 0.38, 0.6, 0.82, 0.97, 1, 0.93, 0.8, 0.64, 0.5];

/** 회색: 아주 약하게 차가운 색을 섞는다. 950 은 다크 모드 배경 */
const GRAY_L = [0.985, 0.968, 0.93, 0.876, 0.75, 0.615, 0.525, 0.44, 0.33, 0.245, 0.19];
const GRAY_C = [0.002, 0.003, 0.005, 0.007, 0.01, 0.012, 0.012, 0.012, 0.012, 0.012, 0.011];

const HUES = {
  // 코발트: 차갑고 깊은 파랑 (보라로 기울지 않게)
  blue: { h: 262, c: 0.205 },
  // 크림슨: 주황기를 조금 섞어 탁하지 않은 빨강
  red: { h: 24, c: 0.2 },
  // 에메랄드: 형광 연두가 아닌 깊은 초록
  green: { h: 158, c: 0.14 },
  // 호박색: 노랑이 아닌 따뜻한 앰버
  amber: { h: 68, c: 0.165 },
};

/* ── OKLCH → sRGB ─────────────────────────── */
function oklchToLinearRgb(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);
const encode = (v) => {
  const c = Math.min(1, Math.max(0, v));
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
};
const toHex = (rgb) =>
  '#' +
  rgb
    .map((v) =>
      Math.round(encode(v) * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('');

function oklch(L, C, h) {
  let c = C;
  let rgb = oklchToLinearRgb(L, c, h);
  while (!inGamut(rgb) && c > 0) {
    c -= 0.002;
    rgb = oklchToLinearRgb(L, c, h);
  }
  return toHex(rgb);
}

/* ── 생성 ─────────────────────────────────── */
const scale = (Ls, Cs, h, cMax) =>
  Object.fromEntries(STEPS.map((step, i) => [step, { $value: oklch(Ls[i], Cs[i] * cMax, h) }]));

const gray = {
  0: { $value: '#ffffff' },
  ...Object.fromEntries(
    STEPS.map((step, i) => [step, { $value: oklch(GRAY_L[i], GRAY_C[i], 265) }]),
  ),
};

const color = {
  color: {
    $type: 'color',
    white: { $value: '#ffffff' },
    black: { $value: '#000000' },
    gray,
    ...Object.fromEntries(
      Object.entries(HUES).map(([name, { h, c }]) => [name, scale(TONE_L, TONE_C, h, c)]),
    ),
  },
};

const out = new URL('../src/primitive/color.json', import.meta.url);
await writeFile(out, `${JSON.stringify(color, null, 2)}\n`);
for (const [name, steps] of Object.entries(color.color)) {
  if (typeof steps === 'object' && !('$value' in steps) && name !== '$type') {
    console.log(
      name.padEnd(6),
      Object.values(steps)
        .map((s) => s.$value)
        .join(' '),
    );
  }
}
