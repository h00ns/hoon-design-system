import { Button, Progress } from '@hoon-ds/react';
import { useEffect, useState } from 'react';

export default function LiveExample() {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const running = started && value < 100;
  const done = value === 100;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setValue((v) => Math.min(v + 5, 100));
    }, 200);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 360 }}>
      <Progress
        value={value}
        label={done ? '업로드 완료' : '업로드'}
        tone={done ? 'success' : 'accent'}
        showValue
      />
      <Button
        variant="secondary"
        loading={running}
        onClick={() => {
          setValue(0);
          setStarted(true);
        }}
      >
        업로드 시작
      </Button>
    </div>
  );
}
