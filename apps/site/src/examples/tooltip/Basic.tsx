import { IconButton, SimpleTooltip } from '@hoon-ds/react';

function GearIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M11.1 2.2a1 1 0 0 0-2.2 0l-.2 1.3a6.6 6.6 0 0 0-1.6.9l-1.2-.5a1 1 0 0 0-1.2.4l-1.1 1.9a1 1 0 0 0 .3 1.3l1 .8a6.7 6.7 0 0 0 0 1.9l-1 .8a1 1 0 0 0-.3 1.3l1.1 1.9a1 1 0 0 0 1.2.4l1.2-.5c.5.4 1 .7 1.6.9l.2 1.3a1 1 0 0 0 2.2 0l.2-1.3c.6-.2 1.1-.5 1.6-.9l1.2.5a1 1 0 0 0 1.2-.4l1.1-1.9a1 1 0 0 0-.3-1.3l-1-.8a6.7 6.7 0 0 0 0-1.9l1-.8a1 1 0 0 0 .3-1.3l-1.1-1.9a1 1 0 0 0-1.2-.4l-1.2.5a6.6 6.6 0 0 0-1.6-.9l-.2-1.3ZM10 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
    </svg>
  );
}

export default function BasicExample() {
  return (
    <SimpleTooltip content="설정">
      {/* 툴팁은 '설명'으로 연결되므로 아이콘 버튼의 이름(aria-label)은 따로 준다 */}
      <IconButton aria-label="설정" variant="secondary">
        <GearIcon />
      </IconButton>
    </SimpleTooltip>
  );
}
