import * as React from 'react';
import { cx } from '../utils/cx';

export type KbdSize = 'sm' | 'md';

/** 기호 키의 스크린리더용 이름. */
export const KBD_KEY_LABELS: Readonly<Record<string, string>> = {
  '⌘': 'Command',
  '⇧': 'Shift',
  '⌥': 'Option',
  '⌃': 'Control',
  '↵': 'Enter',
  '⏎': 'Enter',
  '⌫': 'Backspace',
  '⌦': 'Delete',
  '⎋': 'Escape',
  '⇥': 'Tab',
  '⇪': 'Caps Lock',
  '↑': '위쪽 화살표',
  '↓': '아래쪽 화살표',
  '←': '왼쪽 화살표',
  '→': '오른쪽 화살표',
};

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * 조합 키. 각 키를 `<kbd>` 로 감싼 하나의 `<kbd>` 로 렌더링한다 (HTML 명세의 키 조합 표기).
   * 예: `keys={['⌘', 'K']}`
   */
  keys?: string[];
  /** 조합 키 사이에 보여줄 구분자 (예: `'+'`). 보조기기에서는 숨긴다. */
  separator?: React.ReactNode;
  /** 기호 키 이름을 바꾸거나 더한다. 기본 이름은 `KBD_KEY_LABELS`. */
  labels?: Record<string, string>;
  /** @default 'md' */
  size?: KbdSize;
}

function KeyLabel({ value, labels }: { value: string; labels: Record<string, string> }) {
  const name = labels[value];
  if (!name) return <>{value}</>;
  // 기호는 보조기기마다 읽는 방식이 달라서, 이름을 숨김 텍스트로 주고 기호는 숨긴다.
  // title 은 마우스를 올렸을 때 시각 사용자에게도 이름을 보여준다.
  return (
    <abbr className="hds-kbd__abbr" title={name}>
      <span aria-hidden="true">{value}</span>
      <span className="hds-visually-hidden">{name}</span>
    </abbr>
  );
}

/** 키보드 키를 표시한다. 단축키 안내, 문서의 조작 설명에 쓴다. */
export const Kbd = React.forwardRef<HTMLElement, KbdProps>(function Kbd(
  { keys, separator, labels: labelOverrides, size = 'md', className, children, ...rest },
  ref,
) {
  const labels = labelOverrides ? { ...KBD_KEY_LABELS, ...labelOverrides } : KBD_KEY_LABELS;

  if (keys && keys.length > 0) {
    return (
      <kbd {...rest} ref={ref} className={cx('hds-kbd-group', className)} data-size={size}>
        {keys.map((key, i) => (
          <React.Fragment key={`${key}-${i}`}>
            {i > 0 && separator != null && (
              <span className="hds-kbd-group__separator" aria-hidden="true">
                {separator}
              </span>
            )}
            <kbd className="hds-kbd" data-size={size}>
              <KeyLabel value={key} labels={labels} />
            </kbd>
          </React.Fragment>
        ))}
      </kbd>
    );
  }

  return (
    <kbd {...rest} ref={ref} className={cx('hds-kbd', className)} data-size={size}>
      {typeof children === 'string' ? <KeyLabel value={children} labels={labels} /> : children}
    </kbd>
  );
});
