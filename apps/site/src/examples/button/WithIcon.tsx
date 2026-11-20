import { Button } from '@hoon-ds/react';

function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 4a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export default function WithIconExample() {
  return (
    <Button>
      <PlusIcon />
      추가
    </Button>
  );
}
