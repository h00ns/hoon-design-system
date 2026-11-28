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
  // 채도를 한 단계 낮춰 형광기 없이 차분하게. 색이 많이 모여도 장난감처럼 보이지 않게 한다
  // 코발트: 차갑고 깊은 파랑
  blue: { h: 259, c: 0.17 },
  // 크림슨: 주황기를 조금 섞은 빨강
  red: { h: 22, c: 0.172 },
  // 에메랄드: 연두가 아닌 깊은 초록
  green: { h: 163, c: 0.118 },
  // 앰버(경고): 갈색으로 탁해지지 않도록 노랑 쪽 색상(h)에, 밝은 단계에서 채도가 가장 높은 곡선을 쓴다
  amber: { h: 85, c: 0.17, curve: 'yellow' },
};

/** 노랑은 밝을 때 가장 노랗게 보인다 → 밝은 단계(200~400)의 채도를 높이고, 어두운 단계는 갈색이 되지 않게 줄인다 */
const YELLOW_C = [0.16, 0.32, 0.6, 0.88, 1, 0.98, 0.88, 0.78, 0.68, 0.58, 0.46];
/** 단계별 색상(h): 밝을수록 노랑, 어두울수록 호박색. 어두운 노랑이 올리브·갈색처럼 탁해지는 것을 막는다 */
const YELLOW_H = [94, 93, 91, 88, 84, 78, 70, 64, 60, 58, 56];
const YELLOW_L = [0.987, 0.968, 0.94, 0.905, 0.865, 0.79, 0.66, 0.545, 0.45, 0.36, 0.275];

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
const scale = (Ls, Cs, h, cMax, Hs) =>
  Object.fromEntries(
    STEPS.map((step, i) => [step, { $value: oklch(Ls[i], Cs[i] * cMax, Hs ? Hs[i] : h) }]),
  );

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
      Object.entries(HUES).map(([name, { h, c, curve }]) => [
        name,
        curve === 'yellow'
          ? scale(YELLOW_L, YELLOW_C, h, c, YELLOW_H)
          : scale(TONE_L, TONE_C, h, c),
      ]),
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
