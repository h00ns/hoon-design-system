import * as React from 'react';
import { Portal, Toast as ToastPrimitive } from 'radix-ui';
import { CloseIcon, DEFAULT_TONE_LABELS, STATUS_ICONS } from '../alert/icons';
import { Button } from '../button/Button';
import { IconButton } from '../icon-button/IconButton';
import { cx } from '../utils/cx';
import { dismissToast, toastStore } from './toast-store';
import type { ToastRecord } from './toast-store';

export type ToasterPosition =
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface ToasterProps {
  /** @default 'bottom-right' */
  position?: ToasterPosition;
  /** 기본 표시 시간(ms). 포인터를 올리거나 포커스가 있거나 창이 비활성이면 멈춘다. @default 5000 */
  duration?: number;
  /** 동시에 보이는 최대 개수. 넘치면 앞의 토스트가 닫힐 때까지 기다린다. @default 3 */
  limit?: number;
  /** 알림 영역으로 바로 이동하는 단축키. @default ['F8'] */
  hotkey?: string[];
  /** 알림 영역의 접근 가능한 이름. `{hotkey}` 는 단축키로 바뀐다. @default '알림 ({hotkey})' */
  label?: string;
  /** 각 토스트를 읽을 때 앞에 붙는 이름. @default '알림' */
  toastLabel?: string;
  /** 닫기 버튼 이름. @default '닫기' */
  closeLabel?: string;
  /** 톤별로 스크린리더가 읽을 접두어. */
  toneLabels?: Partial<Record<'info' | 'success' | 'warning' | 'danger', string>>;
  /**
   * 알림 영역을 렌더링할 곳. 기본은 `document.body` 끝이다.
   * Toaster 를 컴포넌트 트리 깊은 곳에 두어도 부모의 쌓임 맥락(z-index, overflow)에 갇히지 않게 하기 위해서다.
   */
  container?: HTMLElement | null;
  className?: string;
}

const SWIPE: Record<ToasterPosition, 'up' | 'down' | 'left' | 'right'> = {
  'top-left': 'left',
  'top-center': 'up',
  'top-right': 'right',
  'bottom-left': 'left',
  'bottom-center': 'down',
  'bottom-right': 'right',
};

/**
 * 토스트가 나타나는 영역. 앱 최상단에 한 번만 둔다.
 * 토스트는 `toast()` 함수로 띄운다.
 */
export function Toaster({
  position = 'bottom-right',
  duration = 5000,
  limit = 3,
  hotkey,
  label = '알림 ({hotkey})',
  toastLabel = '알림',
  closeLabel = '닫기',
  toneLabels,
  container,
  className,
}: ToasterProps) {
  const toasts = React.useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot,
  );

  // 닫히는 중인 토스트는 애니메이션을 위해 남겨두고, 열린 것은 limit 까지만 보여준다 (나머지는 대기).
  // 단, 오류(danger)는 대기열에 넣지 않는다 — 덜 중요한 알림 때문에 오류가 늦게 전달되면 안 된다.
  const openDanger = toasts.filter((t) => t.open && t.tone === 'danger').length;
  const visible: ToastRecord[] = [];
  let otherSlots = Math.max(0, limit - openDanger);
  for (const t of toasts) {
    if (!t.open || t.tone === 'danger') visible.push(t);
    else if (otherSlots > 0) {
      visible.push(t);
      otherSlots -= 1;
    }
  }

  return (
    <ToastPrimitive.Provider
      duration={duration}
      swipeDirection={SWIPE[position]}
      label={toastLabel}
    >
      {visible.map((t) => (
        <ToastItem
          key={t.id}
          toast={t}
          closeLabel={closeLabel}
          toneLabel={
            t.tone && t.tone !== 'neutral'
              ? (toneLabels?.[t.tone] ?? DEFAULT_TONE_LABELS[t.tone])
              : undefined
          }
        />
      ))}
      <Portal.Root container={container}>
        <ToastPrimitive.Viewport
          className={cx('hds-toast-viewport', className)}
          data-position={position}
          hotkey={hotkey}
          label={label}
        />
      </Portal.Root>
    </ToastPrimitive.Provider>
  );
}

interface ToastItemProps {
  toast: ToastRecord;
  closeLabel: string;
  toneLabel: string | undefined;
}

function ToastItem({ toast: t, closeLabel, toneLabel }: ToastItemProps) {
  const tone = t.tone ?? 'neutral';
  const Icon = tone === 'neutral' ? null : STATUS_ICONS[tone];
  const duration = t.duration ?? (t.action ? Infinity : undefined);
  const prefix = toneLabel ? <span className="hds-visually-hidden">{`${toneLabel}: `}</span> : null;

  return (
    <ToastPrimitive.Root
      className="hds-toast"
      data-tone={tone}
      open={t.open}
      onOpenChange={(open) => {
        if (!open) dismissToast(t.id);
      }}
      duration={duration}
      type={t.type ?? (tone === 'danger' ? 'foreground' : 'background')}
    >
      {Icon && (
        <span className="hds-toast__icon" aria-hidden="true">
          <Icon />
        </span>
      )}
      <div className="hds-toast__content">
        {t.title != null && (
          <ToastPrimitive.Title className="hds-toast__title">
            {prefix}
            {t.title}
          </ToastPrimitive.Title>
        )}
        {t.description != null && (
          <ToastPrimitive.Description className="hds-toast__description">
            {t.title == null && prefix}
            {t.description}
          </ToastPrimitive.Description>
        )}
      </div>
      {t.action && (
        <ToastPrimitive.Action altText={t.action.altText} asChild>
          <Button
            className="hds-toast__action"
            size="sm"
            variant="secondary"
            onClick={t.action.onClick}
          >
            {t.action.label}
          </Button>
        </ToastPrimitive.Action>
      )}
      <ToastPrimitive.Close asChild>
        <IconButton className="hds-toast__close" size="sm" aria-label={closeLabel}>
          <CloseIcon />
        </IconButton>
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}
