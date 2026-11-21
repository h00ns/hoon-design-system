import { IconButton, Popover } from '@hoon-ds/react';

function InfoIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 7a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0v-4a1 1 0 0 0-1-1Zm0-4a1.2 1.2 0 1 0 0 2.4A1.2 1.2 0 0 0 10 5Z" />
    </svg>
  );
}

export default function WithArrowExample() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton aria-label="적립금 안내" variant="secondary">
          <InfoIcon />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content arrow>
        <div style={{ maxWidth: 240 }}>
          <Popover.Title>적립금 안내</Popover.Title>
          <Popover.Description>
            구매 확정 후 7일 뒤에 지급되며 1년간 사용할 수 있습니다.{' '}
            <a href="#points" style={{ color: 'var(--hds-color-accent-fg)' }}>
              자세히 보기
            </a>
          </Popover.Description>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
