# @hoon-ds/icons

hoon-design-system 의 아이콘. UI 에 자주 쓰는 아이콘을 골라 담았고, React 컴포넌트와 원본 SVG 를 함께 제공한다.

- 기본은 **장식 아이콘**: `aria-hidden` 처리되어 스크린리더가 읽지 않는다.
- 아이콘만으로 의미를 전할 때는 `title` 을 주면 `role="img"` 와 `<title>` 로 읽힌다.
- 크기 기본값은 `1em`, 색은 `currentColor` 라서 주변 글자를 그대로 따라간다.
- 아이콘마다 개별 export 라 쓴 것만 번들에 들어간다.

## 설치

```sh
pnpm add @hoon-ds/icons
```

## React

```tsx
import { SearchIcon, TrashIcon, WarningIcon } from '@hoon-ds/icons';

// 장식: 옆에 글자가 있으니 숨긴다 (기본값)
<Button><TrashIcon /> 삭제</Button>

// 아이콘만 있는 버튼: 이름은 버튼에 붙인다
<IconButton aria-label="검색"><SearchIcon /></IconButton>

// 아이콘 자체가 정보일 때만 title
<WarningIcon title="경고" weight="fill" />
```

| prop       | 타입                            | 기본값           | 설명                                     |
| ---------- | ------------------------------- | ---------------- | ---------------------------------------- |
| `size`     | `number \| string`              | `'1em'`          | 가로·세로 크기                           |
| `weight`   | `'regular' \| 'bold' \| 'fill'` | `'regular'`      | 획 굵기                                  |
| `title`    | `string`                        | -                | 접근 가능한 이름. 없으면 장식으로 숨긴다 |
| `color`    | `string`                        | `'currentColor'` | 채우기 색                                |
| `mirrored` | `boolean`                       | `false`          | RTL 문서에서 좌우 반전                   |

## React 없이

원본 SVG 를 그대로 쓸 수 있다. 굵기는 파일 이름 뒤에 `-bold`, `-fill` 을 붙인다.

```js
import searchUrl from '@hoon-ds/icons/svg/search.svg';
import searchBold from '@hoon-ds/icons/svg/search-bold.svg?raw';
```

## 메타데이터

검색 UI 를 만들 때 쓰는 이름·분류·검색어(한국어·영어)를 제공한다.

```ts
import { ICON_CATEGORIES, ICON_META } from '@hoon-ds/icons/meta';
```

## 출처

아이콘 모양은 [Phosphor Icons](https://phosphoricons.com) (MIT, © Phosphor Icons) 에서 가져왔다. 자세한 내용은 [LICENSE](./LICENSE) 를 본다.
