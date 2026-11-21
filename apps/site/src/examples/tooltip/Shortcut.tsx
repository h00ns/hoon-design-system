import { Button, SimpleTooltip } from '@hoon-ds/react';

export default function ShortcutExample() {
  return (
    <SimpleTooltip content="저장 (⌘S)">
      {/* 단축키는 aria-keyshortcuts 로도 알려 스크린리더가 읽게 한다 */}
      <Button aria-keyshortcuts="Meta+S">저장</Button>
    </SimpleTooltip>
  );
}
