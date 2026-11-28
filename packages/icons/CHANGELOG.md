# @hoon-ds/icons

## 0.1.0

### Minor Changes

- c4b4349: 새 패키지 `@hoon-ds/icons` 를 추가했다. UI 에 자주 쓰는 아이콘 141개를 React 컴포넌트(`SearchIcon` 등)와 원본 SVG(`@hoon-ds/icons/svg/*.svg`)로 제공한다.
  
  - 기본은 장식 아이콘(`aria-hidden`), `title` 을 주면 `role="img"` 로 이름을 가진다.
  - `size`(기본 `1em`), `weight`(`regular`·`bold`·`fill`), `color`(기본 `currentColor`), `mirrored` 를 받는다.
  - 아이콘마다 개별 export 라 쓴 것만 번들에 들어간다. 서버 컴포넌트에서도 쓸 수 있다.
  - 검색 UI 용 메타데이터(`@hoon-ds/icons/meta`)를 함께 제공한다.
  - 아이콘 모양은 Phosphor Icons (MIT) 에서 가져왔다.
