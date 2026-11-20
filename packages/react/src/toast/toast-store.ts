import type * as React from 'react';

export type ToastTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface ToastAction {
  /** 버튼에 보이는 문구. */
  label: React.ReactNode;
  /**
   * 스크린리더 사용자를 위한 대체 동작 설명 (필수).
   * 토스트는 낭독 중 포커스가 가지 않으므로, 같은 동작을 다른 경로로 하는 방법을 알려준다.
   * 예) "설정 > 휴지통에서 되돌릴 수 있습니다"
   */
  altText: string;
  onClick: () => void;
}

export interface ToastOptions {
  /** 지정하면 같은 id 의 토스트를 새로 띄우지 않고 내용을 바꾼다. */
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** @default 'neutral' */
  tone?: ToastTone;
  /**
   * 자동으로 닫히기까지의 시간(ms). `Infinity` 면 사용자가 닫을 때까지 유지.
   * @default action 이 있으면 Infinity, 없으면 Toaster 의 duration
   */
  duration?: number;
  /** 되돌리기 같은 보조 동작 하나. */
  action?: ToastAction;
  /**
   * 스크린리더 알림 우선순위.
   * - `'foreground'`: 하던 낭독을 끊고 즉시 읽는다 (사용자 행동의 직접 결과, 오류)
   * - `'background'`: 하던 낭독이 끝난 뒤 읽는다 (백그라운드 작업 완료 등)
   * @default tone 이 'danger' 면 'foreground', 아니면 'background'
   */
  type?: 'foreground' | 'background';
  /** 닫힌 뒤(자동·수동·스와이프 모두) 호출된다. */
  onDismiss?: () => void;
}

export interface ToastRecord extends ToastOptions {
  id: string;
  open: boolean;
}

type Listener = () => void;

/** 닫힘 애니메이션이 끝날 시간을 준 뒤 목록에서 제거한다. */
const REMOVE_DELAY = 1000;

let toasts: ToastRecord[] = [];
let counter = 0;
const listeners = new Set<Listener>();
const removeTimers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  for (const listener of listeners) listener();
}

function set(next: ToastRecord[]) {
  toasts = next;
  emit();
}

export const toastStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => toasts,
  getServerSnapshot: (): ToastRecord[] => EMPTY,
};

const EMPTY: ToastRecord[] = [];

function upsert(options: ToastOptions): string {
  const id = options.id ?? `hds-toast-${++counter}`;
  const existing = toasts.find((t) => t.id === id);
  if (existing) {
    const pending = removeTimers.get(id);
    if (pending) {
      clearTimeout(pending);
      removeTimers.delete(id);
    }
    set(toasts.map((t) => (t.id === id ? { ...t, ...options, id, open: true } : t)));
  } else {
    set([...toasts, { ...options, id, open: true }]);
  }
  return id;
}

export function dismissToast(id?: string) {
  const targets = toasts.filter((t) => t.open && (id === undefined || t.id === id));
  if (!targets.length) return;
  const ids = new Set(targets.map((t) => t.id));
  set(toasts.map((t) => (ids.has(t.id) ? { ...t, open: false } : t)));
  for (const target of targets) {
    target.onDismiss?.();
    removeTimers.set(
      target.id,
      setTimeout(() => {
        removeTimers.delete(target.id);
        set(toasts.filter((t) => t.id !== target.id));
      }, REMOVE_DELAY),
    );
  }
}

/** 테스트용: 모든 토스트와 타이머를 즉시 비운다. 공개 API 아님. */
export function resetToasts() {
  for (const timer of removeTimers.values()) clearTimeout(timer);
  removeTimers.clear();
  counter = 0;
  set([]);
}

type ToastInput = React.ReactNode | ToastOptions;

function isOptions(input: ToastInput): input is ToastOptions {
  return (
    typeof input === 'object' &&
    input !== null &&
    !Array.isArray(input) &&
    !('$$typeof' in input) &&
    !(Symbol.iterator in input)
  );
}

function normalize(input: ToastInput, options?: Omit<ToastOptions, 'title'>): ToastOptions {
  return isOptions(input) ? { ...input, ...options } : { ...options, title: input };
}

type ToneShortcut = (
  title: React.ReactNode,
  options?: Omit<ToastOptions, 'title' | 'tone'>,
) => string;

interface ToastFn {
  /**
   * 토스트를 띄우고 id 를 돌려준다.
   * @example toast('저장했습니다')
   * @example toast({ title: '삭제했습니다', action: { label: '되돌리기', altText: '…', onClick: undo } })
   */
  (input: ToastInput, options?: Omit<ToastOptions, 'title'>): string;
  info: ToneShortcut;
  success: ToneShortcut;
  warning: ToneShortcut;
  error: ToneShortcut;
  /** id 를 주면 그 토스트만, 생략하면 모두 닫는다. */
  dismiss: (id?: string) => void;
}

const shortcut =
  (tone: ToastTone): ToneShortcut =>
  (title, options) =>
    upsert({ ...options, title, tone });

export const toast: ToastFn = Object.assign(
  (input: ToastInput, options?: Omit<ToastOptions, 'title'>) => upsert(normalize(input, options)),
  {
    info: shortcut('info'),
    success: shortcut('success'),
    warning: shortcut('warning'),
    error: shortcut('danger'),
    dismiss: dismissToast,
  },
);
