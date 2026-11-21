import { Field, IconButton, Input } from '@hoon-ds/react';
import { useState } from 'react';

function EyeIcon({ off = false }: { off?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10Z" />
      <circle cx="10" cy="10" r="2.5" />
      {off && <path d="m3 3 14 14" strokeLinecap="round" />}
    </svg>
  );
}

export default function PasswordExample() {
  const [visible, setVisible] = useState(false);

  return (
    <Field.Root style={{ width: '100%', maxWidth: 360 }}>
      <Field.Label>비밀번호</Field.Label>
      <Input
        type={visible ? 'text' : 'password'}
        autoComplete="current-password"
        endSlot={
          <IconButton
            size="sm"
            aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
            aria-pressed={visible}
            onClick={() => setVisible((v) => !v)}
          >
            <EyeIcon off={visible} />
          </IconButton>
        }
      />
    </Field.Root>
  );
}
