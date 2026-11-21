import { Button, DropdownMenu } from '@hoon-ds/react';

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M5.5 5.5h8v8h-8zM10.5 5.5v-3h-8v8h3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function InsetExample() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">편집</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        <DropdownMenu.Item>
          <CopyIcon />
          복사
        </DropdownMenu.Item>
        <DropdownMenu.Item inset>붙여넣기</DropdownMenu.Item>
        <DropdownMenu.Item inset>서식 없이 붙여넣기</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
