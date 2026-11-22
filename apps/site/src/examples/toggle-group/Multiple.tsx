import { ToggleGroup } from '@hoon-ds/react';

function BoldIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M6 4h5a3 3 0 0 1 0 6H6zM6 10h6a3 3 0 0 1 0 6H6z" />
    </svg>
  );
}

function ItalicIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 4H8M12 16H8M11 4 9 16" />
    </svg>
  );
}

function UnderlineIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 4v6a4 4 0 0 0 8 0V4M5 17h10" />
    </svg>
  );
}

export default function MultipleExample() {
  return (
    <ToggleGroup.Root type="multiple" aria-label="글자 서식" defaultValue={['bold']}>
      {/* 아이콘만 있는 항목은 aria-label 이 타입 단계에서 필수다 */}
      <ToggleGroup.Item value="bold" icon={<BoldIcon />} aria-label="굵게" />
      <ToggleGroup.Item value="italic" icon={<ItalicIcon />} aria-label="기울임" />
      <ToggleGroup.Item value="underline" icon={<UnderlineIcon />} aria-label="밑줄" />
    </ToggleGroup.Root>
  );
}
