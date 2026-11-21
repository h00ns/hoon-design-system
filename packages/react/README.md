# @hoon-ds/react

접근성과 사용성을 기본값으로 갖춘 React 컴포넌트. [Radix](https://www.radix-ui.com/) 위에 만들었다.

📘 **문서: https://h00ns.github.io/hoon-design-system/**

```bash
pnpm add @hoon-ds/react @hoon-ds/css @hoon-ds/tokens
```

```tsx
import '@hoon-ds/tokens/css';
import '@hoon-ds/css';
import { Button } from '@hoon-ds/react';

<Button onClick={save}>저장</Button>;
```

- React 18.2+ / 19, ESM + CJS, TypeScript 타입 포함
- Next.js App Router 에서 바로 사용 가능 (`'use client'` 포함)
- 키보드(WAI-ARIA APG) · 스크린리더 · 다크 모드 · 동작 줄이기 · Windows 고대비 지원

**컴포넌트:** Button, IconButton, Field, Input, Textarea, Checkbox, RadioGroup, Switch, Select, Dialog, AlertDialog, Popover, Tooltip, DropdownMenu, Toast, Alert, Spinner, Skeleton, Tabs, Accordion, Badge, Avatar, Separator, VisuallyHidden

## License

MIT
