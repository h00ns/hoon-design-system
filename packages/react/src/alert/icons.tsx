import * as React from 'react';

/** 상태 톤. Alert 와 Toast 가 공유한다. */
export type StatusTone = 'info' | 'success' | 'warning' | 'danger';

type IconProps = React.SVGProps<SVGSVGElement>;

const base: IconProps = {
  viewBox: '0 0 20 20',
  fill: 'currentColor',
  'aria-hidden': true,
  focusable: false,
};

export const InfoIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 7a.9.9 0 0 0-.9.9v4.2a.9.9 0 0 0 1.8 0V9.9A.9.9 0 0 0 10 9Zm0-3.2a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z" />
  </svg>
);

export const SuccessIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm3.64 5.24a.9.9 0 0 0-1.27.04l-3.3 3.53-1.45-1.45a.9.9 0 1 0-1.27 1.28l2.1 2.1a.9.9 0 0 0 1.3-.03l3.94-4.2a.9.9 0 0 0-.05-1.27Z" />
  </svg>
);

export const WarningIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M8.58 2.83a1.64 1.64 0 0 1 2.84 0l6.6 11.7A1.64 1.64 0 0 1 16.6 17H3.4a1.64 1.64 0 0 1-1.42-2.47l6.6-11.7ZM10 12.9a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm0-6.4a.9.9 0 0 0-.9.9v3.6a.9.9 0 0 0 1.8 0V7.4a.9.9 0 0 0-.9-.9Z" />
  </svg>
);

export const DangerIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm-2.47 4.27a.9.9 0 0 0-1.26 1.26L8.73 10l-2.46 2.47a.9.9 0 1 0 1.26 1.26L10 11.27l2.47 2.46a.9.9 0 0 0 1.26-1.26L11.27 10l2.46-2.47a.9.9 0 0 0-1.26-1.26L10 8.73 7.53 6.27Z" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L8.94 10l-4.72 4.72a.75.75 0 1 0 1.06 1.06L10 11.06l4.72 4.72a.75.75 0 1 0 1.06-1.06L11.06 10l4.72-4.72a.75.75 0 0 0-1.06-1.06L10 8.94 5.28 4.22Z" />
  </svg>
);

export const STATUS_ICONS: Record<StatusTone, (props: IconProps) => React.ReactElement> = {
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  danger: DangerIcon,
};

/** 색만으로 상태를 전달하지 않도록 스크린리더에 붙이는 접두어 (WCAG 1.4.1) */
export const DEFAULT_TONE_LABELS: Record<StatusTone, string> = {
  info: '안내',
  success: '성공',
  warning: '주의',
  danger: '오류',
};
