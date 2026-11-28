import * as React from 'react';

/** 상태 톤. Alert 와 Toast 가 공유한다. */
export type StatusTone = 'info' | 'success' | 'warning' | 'critical';

type IconProps = React.SVGProps<SVGSVGElement>;

const cxIcon = (className?: string) =>
  className ? `hds-status-icon ${className}` : 'hds-status-icon';

const base: IconProps = {
  viewBox: '0 0 20 20',
  fill: 'currentColor',
  'aria-hidden': true,
  focusable: false,
};

/*
 * 상태 아이콘은 두 색으로 그린다: 바탕 도형(.hds-status-icon__shape)은 톤 색,
 * 안쪽 기호(.hds-status-icon__mark)는 대비가 큰 색. 색은 CSS 변수(--_icon, --_icon-mark)로 받는다.
 * 노란 경고 아이콘도 진한 느낌표 덕분에 흰 바탕에서 또렷하다 (도로 표지판과 같은 원리).
 */
const MARK = { className: 'hds-status-icon__mark' };
const MARK_STROKE = {
  className: 'hds-status-icon__mark',
  fill: 'none',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const InfoIcon = (props: IconProps) => (
  <svg {...base} {...props} className={cxIcon(props.className)}>
    <circle className="hds-status-icon__shape" cx="10" cy="10" r="8.25" />
    <rect {...MARK} x="9.1" y="8.9" width="1.8" height="5.4" rx="0.9" />
    <circle {...MARK} cx="10" cy="6.4" r="1.1" />
  </svg>
);

export const SuccessIcon = (props: IconProps) => (
  <svg {...base} {...props} className={cxIcon(props.className)}>
    <circle className="hds-status-icon__shape" cx="10" cy="10" r="8.25" />
    <path {...MARK_STROKE} d="M6.5 10.3l2.4 2.4 4.6-4.9" />
  </svg>
);

export const WarningIcon = (props: IconProps) => (
  <svg {...base} {...props} className={cxIcon(props.className)}>
    <path
      className="hds-status-icon__shape"
      d="M8.48 2.9a1.75 1.75 0 0 1 3.04 0l6.67 11.83A1.75 1.75 0 0 1 16.67 17.3H3.33a1.75 1.75 0 0 1-1.52-2.57L8.48 2.9Z"
    />
    <rect {...MARK} x="9.1" y="6.9" width="1.8" height="5.2" rx="0.9" />
    <circle {...MARK} cx="10" cy="14.2" r="1.1" />
  </svg>
);

export const CriticalIcon = (props: IconProps) => (
  <svg {...base} {...props} className={cxIcon(props.className)}>
    <circle className="hds-status-icon__shape" cx="10" cy="10" r="8.25" />
    <path {...MARK_STROKE} d="M7.4 7.4l5.2 5.2M12.6 7.4l-5.2 5.2" />
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
  critical: CriticalIcon,
};

/** 색만으로 상태를 전달하지 않도록 스크린리더에 붙이는 접두어 (WCAG 1.4.1) */
export const DEFAULT_TONE_LABELS: Record<StatusTone, string> = {
  info: '안내',
  success: '성공',
  warning: '주의',
  critical: '오류',
};
