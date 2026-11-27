# @hoon-ds/react

## 0.2.0

### Minor Changes

- 1592717: 전수 QA 수정: 팔레트 채도를 낮추고 accent 를 한 단계 깊게(blue-700), `bg-selected` 토큰 추가. Badge 를 테두리 없는 옅은 배경으로 재디자인. Avatar 이니셜에 이름 기반 색(`color` prop, `getAvatarColor`). Toaster 알림 영역을 body 로 포털해 부모 쌓임 맥락에 가려지지 않게(`container` prop). Tooltip 이 Tab 이동 시 자동 스크롤 때문에 바로 닫히던 문제 수정. Pagination 페이지 이름을 "3 페이지" 로 바꿔 보이는 숫자와 일치(WCAG 2.5.3). ToggleGroup·Tabs segmented 의 선택 칸이 다크 모드에서 보이지 않던 문제 수정.

### Patch Changes

- 1212ba0: Tabs: `segmented` 목록이 Root 의 직계 자식이 아니어도 스타일을 받도록 수정하고, 탭 목록이 스크롤 영역이라 잘리던 포커스 링을 안쪽에 그린다.
- 79e50c0: 시각 리프레시: OKLCH 기반 새 팔레트, 색조별 테두리(`*-border`)·포커스 번짐(`focus-halo`)·컨트롤 hover(`border-control-hover`)·`border-strong`·`shadow-xs` 토큰 추가, 모서리(radius) 한 단계 키움, 다크 모드 옅은 배경을 반투명 색으로. 입력 컨트롤 포커스를 "강조 테두리 + 바깥 번짐"으로 통일하고 hover 가 포커스를 덮지 않게 수정. Button·Badge·Alert 재디자인.
- Updated dependencies [1592717]
- Updated dependencies [1212ba0]
- Updated dependencies [79e50c0]
  - @hoon-ds/css@0.2.0

## 0.1.0

### Minor Changes

- 1572f39: Card, Table, Breadcrumb, Pagination, Link, Kbd 컴포넌트 추가. 누를 수 있는 카드(대표 링크 확장), 정렬·선택·고정 머리 행을 지원하는 표, 경로 접기, 링크/버튼 겸용 페이지 이동, 새 창 안내가 붙는 외부 링크, 기호 키 이름을 전달하는 키 표시.
- 094c84b: Combobox, Slider, ToggleGroup·Toggle 추가. Combobox 는 WAI-ARIA APG 의 listbox popup 패턴을 따르며 한글 IME 조합 중 Enter 를 무시한다. Slider 는 범위 손잡이에 한국어 이름과 `aria-valuetext` 를 지원한다.
- 6557bd9: Sheet, HoverCard, Progress, Collapsible, ScrollArea 컴포넌트 추가. Dialog.Body 의 넘침 감지 로직을 공용 훅으로 분리.
- f772bd9: 첫 공개 릴리스. 디자인 토큰(light/dark, WCAG 대비 검증), 순수 CSS 컴포넌트 스타일, 접근성을 갖춘 React 컴포넌트 24종.

### Patch Changes

- Updated dependencies [1572f39]
- Updated dependencies [094c84b]
- Updated dependencies [6557bd9]
- Updated dependencies [f772bd9]
  - @hoon-ds/css@0.1.0
