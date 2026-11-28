---
'@hoon-ds/tokens': minor
'@hoon-ds/css': minor
'@hoon-ds/react': minor
---

**이름 변경(호환되지 않음):** `danger` 를 `critical` 로 바꿨다. 토큰(`--hds-color-danger-*` → `--hds-color-critical-*`), CSS(`data-tone="critical"`, `data-variant="critical"`), React API(`Button variant="critical"`, `Badge`·`Alert`·`Progress` 의 `tone="critical"`, Toast 톤)를 모두 바꿔야 한다. `toast.critical()` 을 추가했고 `toast.error()` 는 별칭으로 남는다.

- 경고 색(amber)을 갈색 없이 맑은 노랑으로 다시 만들었다 (밝은 단계는 노랑, 글자용 어두운 단계는 호박색).
- 상태 아이콘(Alert·Toast)을 두 색으로: 바탕 도형은 톤 색, 안쪽 기호는 대비 큰 색. `*-icon`, `*-icon-mark` 토큰 추가.
- Tabs: 탭을 바꾸면 선택 표시(밑줄·칩)가 새 탭으로 미끄러지듯 이동한다 (동작 줄이기면 즉시). 마우스로 누를 때 포커스 링이 그려지던 문제 수정.
- Toaster 기본 위치를 `top-right` 로.
