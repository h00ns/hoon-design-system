import { Button, Checkbox, RadioGroup } from '@hoon-ds/react';
import { useState } from 'react';

const KEYS = [
  { key: 'Tab', label: 'Tab' },
  { key: 'Shift', label: 'Shift' },
  { key: ' ', label: 'Space' },
  { key: 'Enter', label: 'Enter' },
  { key: 'ArrowUp', label: '↑' },
  { key: 'ArrowDown', label: '↓' },
  { key: 'ArrowLeft', label: '←' },
  { key: 'ArrowRight', label: '→' },
];

/** 이 영역 안에서 누른 키를 키캡으로 보여준다. 컴포넌트는 모두 실제로 동작한다. */
export default function KeyboardDemo() {
  const [pressed, setPressed] = useState<Set<string>>(new Set());

  const onKey = (down: boolean) => (e: React.KeyboardEvent) => {
    const k = KEYS.find((x) => x.key === e.key)?.key;
    if (!k) return;
    setPressed((prev) => {
      const next = new Set(prev);
      if (down) next.add(k);
      else next.delete(k);
      return next;
    });
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- 키 입력을 시각화만 한다 (조작은 자식 컨트롤이 담당)
    <div
      className="kb-demo"
      onKeyDown={onKey(true)}
      onKeyUp={onKey(false)}
      onBlur={() => setPressed(new Set())}
    >
      <div className="kb-demo__keys" aria-hidden="true">
        {KEYS.map(({ key, label }) => (
          <kbd key={key} className="keycap" data-pressed={pressed.has(key) || undefined}>
            {label}
          </kbd>
        ))}
      </div>
      <div className="kb-demo__controls">
        <Checkbox defaultChecked>이용 약관에 동의</Checkbox>
        <RadioGroup.Root defaultValue="fast" aria-label="배송 방법" orientation="horizontal">
          <RadioGroup.Item value="fast">빠른 배송</RadioGroup.Item>
          <RadioGroup.Item value="normal">일반 배송</RadioGroup.Item>
        </RadioGroup.Root>
        <Button size="sm">주문하기</Button>
      </div>
    </div>
  );
}
