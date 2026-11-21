# hoon-design-system

📘 **문서: https://h00ns.github.io/hoon-design-system/**

접근성과 사용성을 기본값으로 갖춘 React 디자인 시스템.
토큰과 스타일은 프레임워크와 무관하게 만들고, 동작은 [Radix](https://www.radix-ui.com/) 위에 React 로 구현한다.

## 패키지

| 패키지                               | 설명                                                                                     |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| [`@hoon-ds/tokens`](packages/tokens) | 디자인 토큰(DTCG JSON) → CSS 변수 · JS · JSON. light/dark 테마, WCAG 대비 테스트 포함    |
| [`@hoon-ds/css`](packages/css)       | 컴포넌트 스타일. 순수 CSS + cascade layer 라 어떤 프레임워크/순수 HTML 에서도 쓸 수 있다 |
| [`@hoon-ds/react`](packages/react)   | React 컴포넌트. React 18·19 지원, ESM/CJS, RSC 용 `'use client'` 포함                    |
| [`docs`](apps/docs)                  | Storybook 문서 (a11y 애드온, 테마 전환)                                                  |

```
packages/tokens  ──▶  packages/css  ──▶  packages/react
 (CSS 변수)          (.hds-* 클래스)     (동작 + 접근성)
```

## 컴포넌트

| 분류      | 컴포넌트                                                     |
| --------- | ------------------------------------------------------------ |
| 동작      | Button, IconButton                                           |
| 폼        | Field, Input, Textarea, Checkbox, RadioGroup, Switch, Select |
| 오버레이  | Dialog, AlertDialog, Popover, Tooltip, DropdownMenu          |
| 피드백    | Toast, Alert, Spinner, Skeleton                              |
| 구조·표시 | Tabs, Accordion, Badge, Avatar, Separator, VisuallyHidden    |

모든 컴포넌트는 키보드(WAI-ARIA APG), 스크린리더, 다크 모드, 동작 줄이기, Windows 고대비 모드를 지원하고
동작·접근성(axe) 테스트를 갖는다. 문서는 문서 사이트에 있다 (`pnpm dev:site`).

## 사용법

```tsx
import '@hoon-ds/tokens/css'; // 디자인 토큰 (필수)
import '@hoon-ds/css/base.css'; // 전역 베이스 (선택)
import '@hoon-ds/css'; // 컴포넌트 스타일 (필수)

import { Button } from '@hoon-ds/react';

export function Example() {
  return <Button onClick={save}>저장</Button>;
}
```

React 가 아닌 환경에서도 스타일은 그대로 쓸 수 있다.

```html
<button class="hds-button" data-variant="secondary" type="button">취소</button>
```

### 테마

기본은 OS 설정(`prefers-color-scheme`)을 따른다. 강제하려면 `<html data-theme="dark">` 또는 `data-theme="light"`.

## 개발

```bash
pnpm install
pnpm dev:site     # 문서 사이트 (http://localhost:4321/hoon-design-system/)
pnpm dev          # Storybook (http://localhost:6006)
pnpm test         # 토큰 대비 테스트 + 컴포넌트 테스트
pnpm lint         # ESLint (jsx-a11y strict 포함)
pnpm typecheck
pnpm build        # 모든 패키지 빌드
pnpm changeset    # 변경 기록 추가
```

컴포넌트를 추가하기 전에 [CONTRIBUTING.md](CONTRIBUTING.md) 의 완료 기준을 확인한다.
