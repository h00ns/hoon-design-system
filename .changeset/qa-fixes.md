---
'@hoon-ds/tokens': minor
'@hoon-ds/css': patch
'@hoon-ds/react': minor
---

전수 QA 수정: 팔레트 채도를 낮추고 accent 를 한 단계 깊게(blue-700), `bg-selected` 토큰 추가. Badge 를 테두리 없는 옅은 배경으로 재디자인. Avatar 이니셜에 이름 기반 색(`color` prop, `getAvatarColor`). Toaster 알림 영역을 body 로 포털해 부모 쌓임 맥락에 가려지지 않게(`container` prop). Tooltip 이 Tab 이동 시 자동 스크롤 때문에 바로 닫히던 문제 수정. Pagination 페이지 이름을 "3 페이지" 로 바꿔 보이는 숫자와 일치(WCAG 2.5.3). ToggleGroup·Tabs segmented 의 선택 칸이 다크 모드에서 보이지 않던 문제 수정.
