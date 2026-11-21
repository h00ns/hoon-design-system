import { IconButton } from '@hoon-ds/react';

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}

export default function BasicExample() {
  return (
    <IconButton aria-label="닫기">
      <CloseIcon />
    </IconButton>
  );
}
