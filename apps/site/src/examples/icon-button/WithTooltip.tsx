import { IconButton, SimpleTooltip } from '@hoon-ds/react';

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

export default function WithTooltipExample() {
  // aria-label 과 같은 문구를 툴팁으로 보여 시각 사용자도 의미를 알 수 있게 한다
  return (
    <SimpleTooltip content="설정">
      <IconButton aria-label="설정" variant="secondary">
        <SettingsIcon />
      </IconButton>
    </SimpleTooltip>
  );
}
