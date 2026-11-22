# @hoon-ds/css

## 0.1.0

### Minor Changes

- 1572f39: Card, Table, Breadcrumb, Pagination, Link, Kbd 컴포넌트 추가. 누를 수 있는 카드(대표 링크 확장), 정렬·선택·고정 머리 행을 지원하는 표, 경로 접기, 링크/버튼 겸용 페이지 이동, 새 창 안내가 붙는 외부 링크, 기호 키 이름을 전달하는 키 표시.
- 094c84b: Combobox, Slider, ToggleGroup·Toggle 추가. Combobox 는 WAI-ARIA APG 의 listbox popup 패턴을 따르며 한글 IME 조합 중 Enter 를 무시한다. Slider 는 범위 손잡이에 한국어 이름과 `aria-valuetext` 를 지원한다.
- 6557bd9: Sheet, HoverCard, Progress, Collapsible, ScrollArea 컴포넌트 추가. Dialog.Body 의 넘침 감지 로직을 공용 훅으로 분리.
- f772bd9: 첫 공개 릴리스. 디자인 토큰(light/dark, WCAG 대비 검증), 순수 CSS 컴포넌트 스타일, 접근성을 갖춘 React 컴포넌트 24종.

### Patch Changes

- Updated dependencies [f772bd9]
  - @hoon-ds/tokens@0.1.0
