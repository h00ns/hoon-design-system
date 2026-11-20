import * as React from 'react';
import { IconButton } from '../icon-button/IconButton';
import { cx } from '../utils/cx';
import { CloseIcon, DEFAULT_TONE_LABELS, STATUS_ICONS } from './icons';
import type { StatusTone } from './icons';

export type AlertTone = StatusTone;
export type AlertLive = 'off' | 'polite' | 'assertive';

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** @default 'info' */
  tone?: AlertTone;
  /** 굵게 표시되는 요약. */
  title?: React.ReactNode;
  /** 톤 아이콘 대신 쓸 아이콘. `false` 면 아이콘을 숨긴다. */
  icon?: React.ReactNode | false;
  /** 오른쪽(좁은 화면에선 아래)에 놓이는 버튼들. */
  actions?: React.ReactNode;
  /**
   * 스크린리더 알림 방식.
   * - `'off'`(기본): 페이지와 함께 처음부터 있는 정적인 안내
   * - `'polite'`: 나중에 나타나는 안내 → `role="status"` (하던 낭독이 끝난 뒤 읽음)
   * - `'assertive'`: 즉시 알려야 하는 오류 → `role="alert"` (낭독을 끊고 읽음)
   * @default 'off'
   */
  live?: AlertLive;
  /**
   * 색·아이콘을 볼 수 없는 사용자를 위해 내용 앞에 읽어줄 톤 이름.
   * `false` 면 생략. @default 톤별 '안내' | '성공' | '주의' | '오류'
   */
  toneLabel?: string | false;
  /** 주어지면 닫기 버튼을 보여준다. 닫힌 뒤 포커스를 옮길 곳은 호출부에서 정한다. */
  onClose?: () => void;
  /** 닫기 버튼의 접근 가능한 이름. @default '닫기' */
  closeLabel?: string;
}

const LIVE_ROLE: Record<AlertLive, 'status' | 'alert' | undefined> = {
  off: undefined,
  polite: 'status',
  assertive: 'alert',
};

/** 페이지 안에 놓이는 상태 메시지. 잠깐 떴다 사라지는 알림은 Toast 를 쓴다. */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    tone = 'info',
    title,
    icon,
    actions,
    live = 'off',
    toneLabel,
    onClose,
    closeLabel = '닫기',
    className,
    children,
    ...rest
  },
  ref,
) {
  const ToneIcon = STATUS_ICONS[tone];
  const label = toneLabel === undefined ? DEFAULT_TONE_LABELS[tone] : toneLabel;
  const prefix = label ? <span className="hds-visually-hidden">{`${label}: `}</span> : null;

  return (
    <div
      role={LIVE_ROLE[live]}
      {...rest}
      ref={ref}
      className={cx('hds-alert', className)}
      data-tone={tone}
    >
      {icon !== false && (
        <span className="hds-alert__icon" aria-hidden="true">
          {icon ?? <ToneIcon />}
        </span>
      )}
      <div className="hds-alert__content">
        {title != null && (
          <div className="hds-alert__title">
            {prefix}
            {title}
          </div>
        )}
        {children != null && (
          <div className="hds-alert__description">
            {title == null && prefix}
            {children}
          </div>
        )}
      </div>
      {actions != null && <div className="hds-alert__actions">{actions}</div>}
      {onClose && (
        <IconButton
          className="hds-alert__close"
          size="sm"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      )}
    </div>
  );
});
