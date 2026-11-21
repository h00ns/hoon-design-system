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

export default function SizesExample() {
  return (
    <>
      <IconButton aria-label="닫기" size="sm" variant="secondary">
        <CloseIcon />
      </IconButton>
      <IconButton aria-label="닫기" size="md" variant="secondary">
        <CloseIcon />
      </IconButton>
      <IconButton aria-label="닫기" size="lg" variant="secondary">
        <CloseIcon />
      </IconButton>
    </>
  );
}
