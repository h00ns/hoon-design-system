import { Button, SimpleTooltip } from '@hoon-ds/react';

export default function DisabledButtonExample() {
  return (
    <SimpleTooltip content="관리자만 삭제할 수 있습니다">
      {/* 네이티브 disabled 는 포커스·마우스 이벤트를 받지 못하므로 focusableWhenDisabled 를 쓴다 */}
      <Button variant="critical" disabled focusableWhenDisabled>
        삭제
      </Button>
    </SimpleTooltip>
  );
}
