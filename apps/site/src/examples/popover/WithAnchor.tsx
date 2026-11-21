import { Button, Popover } from '@hoon-ds/react';

export default function WithAnchorExample() {
  return (
    <Popover.Root>
      {/* 패널은 트리거(보기 버튼)가 아니라 이 영역 전체를 기준으로 붙는다 */}
      <Popover.Anchor asChild>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            border: '1px solid var(--hds-color-border-default)',
            borderRadius: 8,
          }}
        >
          <span>쿠폰 3장 보유</span>
          <Popover.Trigger asChild>
            <Button size="sm" variant="ghost">
              보기
            </Button>
          </Popover.Trigger>
        </div>
      </Popover.Anchor>
      <Popover.Content align="start" aria-label="보유 쿠폰">
        <ul style={{ margin: 0, paddingInlineStart: 18 }}>
          <li>신규 가입 10% 할인</li>
          <li>무료 배송</li>
          <li>생일 5,000원 할인</li>
        </ul>
      </Popover.Content>
    </Popover.Root>
  );
}
