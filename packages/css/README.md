# @hoon-ds/css

hoon-design-system 의 컴포넌트 스타일. 순수 CSS 라서 React 가 아닌 환경에서도 쓸 수 있다.
모든 규칙은 `@layer hds.components` 안에 있어 레이어 밖의 CSS 로 `!important` 없이 덮어쓸 수 있다.

📘 **문서: https://h00ns.github.io/hoon-design-system/**

```css
@import '@hoon-ds/tokens/css'; /* 필수: 디자인 토큰 */
@import '@hoon-ds/css/base.css'; /* 선택: 전역 베이스 */
@import '@hoon-ds/css'; /* 컴포넌트 스타일 */
```

```html
<button class="hds-button" data-variant="secondary" type="button">취소</button>
```

React 에서는 [`@hoon-ds/react`](https://www.npmjs.com/package/@hoon-ds/react) 가 키보드·포커스·ARIA 동작까지 제공한다.

## License

MIT
