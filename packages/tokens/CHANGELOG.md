# @hoon-ds/tokens

## 0.2.0

### Minor Changes

- 1592717: 전수 QA 수정: 팔레트 채도를 낮추고 accent 를 한 단계 깊게(blue-700), `bg-selected` 토큰 추가. Badge 를 테두리 없는 옅은 배경으로 재디자인. Avatar 이니셜에 이름 기반 색(`color` prop, `getAvatarColor`). Toaster 알림 영역을 body 로 포털해 부모 쌓임 맥락에 가려지지 않게(`container` prop). Tooltip 이 Tab 이동 시 자동 스크롤 때문에 바로 닫히던 문제 수정. Pagination 페이지 이름을 "3 페이지" 로 바꿔 보이는 숫자와 일치(WCAG 2.5.3). ToggleGroup·Tabs segmented 의 선택 칸이 다크 모드에서 보이지 않던 문제 수정.
- 79e50c0: 시각 리프레시: OKLCH 기반 새 팔레트, 색조별 테두리(`*-border`)·포커스 번짐(`focus-halo`)·컨트롤 hover(`border-control-hover`)·`border-strong`·`shadow-xs` 토큰 추가, 모서리(radius) 한 단계 키움, 다크 모드 옅은 배경을 반투명 색으로. 입력 컨트롤 포커스를 "강조 테두리 + 바깥 번짐"으로 통일하고 hover 가 포커스를 덮지 않게 수정. Button·Badge·Alert 재디자인.

## 0.1.0

### Minor Changes

- f772bd9: 첫 공개 릴리스. 디자인 토큰(light/dark, WCAG 대비 검증), 순수 CSS 컴포넌트 스타일, 접근성을 갖춘 React 컴포넌트 24종.
