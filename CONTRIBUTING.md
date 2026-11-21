# 컴포넌트 기여 가이드

이 디자인 시스템은 **접근성과 사용성을 타협하지 않는다.** 아래 완료 기준을 모두 통과해야 컴포넌트를 공개한다.

## 구현 원칙

1. **APG 패턴부터 읽는다.** 만들 컴포넌트에 해당하는 [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/) 패턴의 키보드 동작·역할·상태를 먼저 확인한다.
2. **네이티브 요소가 있으면 네이티브를 쓴다.** `<button>`, `<input>`, `<dialog>` 가 해결하는 걸 `div` + ARIA 로 다시 만들지 않는다.
3. **복잡한 위젯은 Radix 프리미티브 위에 만든다.** 포커스 트랩, 포털, 위치 계산, roving tabindex 를 직접 구현하지 않는다.
4. **스타일은 `@hoon-ds/css` 에, 동작은 `@hoon-ds/react` 에.** React 컴포넌트는 `hds-*` 클래스와 `data-*` 속성만 붙인다.
5. **색·간격·크기는 토큰만 쓴다.** CSS 에 하드코딩된 값이 있으면 리뷰에서 반려한다.

## 완료 기준 (Definition of Done)

### 키보드

- [ ] 모든 기능을 키보드만으로 쓸 수 있다
- [ ] Tab 순서가 시각적 순서와 일치한다
- [ ] `:focus-visible` 포커스 링이 보이고 3:1 이상 대비를 가진다
- [ ] 열고 닫히는 UI 는 닫힐 때 포커스를 트리거로 되돌린다
- [ ] Esc 로 닫을 수 있는 UI 는 Esc 로 닫힌다

### 스크린리더

- [ ] 모든 인터랙티브 요소에 접근 가능한 이름이 있다 (아이콘 전용이면 `aria-label`)
- [ ] 역할(role)과 상태(`aria-expanded`, `aria-selected`, `aria-invalid` …)가 APG 와 일치한다
- [ ] 동적 변화(로딩 완료, 오류)는 live region 등으로 알린다
- [ ] VoiceOver(macOS/iOS)와 NVDA(Windows)로 직접 확인했다

### 시각·사용자 설정

- [ ] light/dark 테마 모두 확인했다
- [ ] 텍스트 4.5:1, UI 경계 3:1 대비를 만족한다 (새 색 조합이면 `tokens/test/contrast.test.ts` 에 추가)
- [ ] `prefers-reduced-motion: reduce` 에서 움직임이 줄어든다
- [ ] `forced-colors: active` (Windows 고대비)에서 경계·포커스·상태가 보인다
- [ ] 브라우저 200% 확대, 320px 너비에서 내용이 잘리거나 겹치지 않는다
- [ ] 터치 타깃이 24×24px 이상이다 (WCAG 2.5.8)

### 사용성·API

- [ ] `className`, `ref`, 나머지 HTML 속성을 루트로 전달한다
- [ ] 비활성·로딩·오류 상태를 다룬다
- [ ] 폼 안에서 쓰일 수 있으면 폼 제출/초기화와 함께 동작한다
- [ ] 한글 IME 입력(조합 중 Enter)에서 오동작하지 않는다 (입력 계열)
- [ ] 제어/비제어(`value` / `defaultValue`) 모두 지원한다 (상태를 가진 컴포넌트)

### 테스트·문서

- [ ] 동작 테스트: 키보드, 상태, 이벤트 (`@testing-library/user-event`)
- [ ] `expectNoA11yViolations` 로 axe 검사
- [ ] Storybook 에 모든 variant·상태 스토리, a11y 패널에 위반 없음
- [ ] 사용자에게 보이는 변경이면 `pnpm changeset`

## 릴리스

1. 사용자에게 보이는 변경이 있으면 PR 에 `pnpm changeset` 으로 변경 기록을 추가한다 (patch / minor / major 선택).
2. main 에 머지되면 Release 워크플로가 **"chore: release" PR** 을 자동으로 만든다 (버전 · CHANGELOG 갱신).
3. 그 PR 을 머지하면 npm 에 배포된다. (저장소 Secret `NPM_TOKEN` 필요)
