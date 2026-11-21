import { Badge } from '@hoon-ds/react';

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M13.3 4.3a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.4L6.6 9.6l5.3-5.3a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export default function WithIconExample() {
  return (
    <Badge tone="success">
      <CheckIcon />
      인증됨
    </Badge>
  );
}
