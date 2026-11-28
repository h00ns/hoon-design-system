import { IconButton } from '@hoon-ds/react';

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <circle cx="10" cy="10" r="2.5" />
      <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" />
    </svg>
  );
}

export default function VariantsExample() {
  return (
    <>
      <IconButton aria-label="설정" variant="primary">
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="설정" variant="secondary">
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="설정" variant="ghost">
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="삭제" variant="critical">
        <TrashIcon />
      </IconButton>
    </>
  );
}
