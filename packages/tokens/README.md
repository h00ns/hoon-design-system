# @hoon-ds/tokens

hoon-design-system 의 디자인 토큰. CSS 변수 · JS · JSON 으로 제공하며 light/dark 테마를 포함한다.
모든 시맨틱 색상 조합은 WCAG 2.2 AA 대비를 테스트로 검증한다.

📘 **문서: https://h00ns.github.io/hoon-design-system/foundations/colors/**

```ts
import '@hoon-ds/tokens/css'; // :root 에 --hds-* CSS 변수
```

```css
.card {
  background: var(--hds-color-bg-raised);
  color: var(--hds-color-fg-default);
  padding: var(--hds-space-4);
  border-radius: var(--hds-radius-lg);
}
```

| 진입점                                     | 내용                                                |
| ------------------------------------------ | --------------------------------------------------- |
| `@hoon-ds/tokens/css`                      | CSS 변수 (light 기본, dark 는 `data-theme`/OS 설정) |
| `@hoon-ds/tokens`                          | JS 상수 + 타입 (light 값)                           |
| `@hoon-ds/tokens/json/light`, `/json/dark` | 평탄화된 JSON                                       |

다크 모드: OS 설정을 자동으로 따르며, `<html data-theme="dark">` 또는 `"light"` 로 강제할 수 있다.

## License

MIT
