import { IconButton, SimpleTooltip, Tooltip } from '@hoon-ds/react';

function GearIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M11.1 2.2a1 1 0 0 0-2.2 0l-.2 1.3a6.6 6.6 0 0 0-1.6.9l-1.2-.5a1 1 0 0 0-1.2.4l-1.1 1.9a1 1 0 0 0 .3 1.3l1 .8a6.7 6.7 0 0 0 0 1.9l-1 .8a1 1 0 0 0-.3 1.3l1.1 1.9a1 1 0 0 0 1.2.4l1.2-.5c.5.4 1 .7 1.6.9l.2 1.3a1 1 0 0 0 2.2 0l.2-1.3c.6-.2 1.1-.5 1.6-.9l1.2.5a1 1 0 0 0 1.2-.4l1.1-1.9a1 1 0 0 0-.3-1.3l-1-.8a6.7 6.7 0 0 0 0-1.9l1-.8a1 1 0 0 0 .3-1.3l-1.1-1.9a1 1 0 0 0-1.2-.4l-1.2.5a6.6 6.6 0 0 0-1.6-.9l-.2-1.3ZM10 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M8 2a1 1 0 0 0-1 1v1H4a1 1 0 0 0 0 2h12a1 1 0 1 0 0-2h-3V3a1 1 0 0 0-1-1H8Zm-3 6h10l-.7 8.1A2 2 0 0 1 12.3 18H7.7a2 2 0 0 1-2-1.9L5 8Z" />
    </svg>
  );
}

export default function IconToolbarExample() {
  return (
    // Provider 로 감싸면 툴팁 사이를 옮겨 다닐 때 지연 없이 바로 열린다
    <Tooltip.Provider>
      <div role="toolbar" aria-label="게시글 도구" style={{ display: 'flex', gap: 4 }}>
        <SimpleTooltip content="설정">
          <IconButton aria-label="설정">
            <GearIcon />
          </IconButton>
        </SimpleTooltip>
        <SimpleTooltip content="삭제">
          <IconButton aria-label="삭제">
            <TrashIcon />
          </IconButton>
        </SimpleTooltip>
      </div>
    </Tooltip.Provider>
  );
}
