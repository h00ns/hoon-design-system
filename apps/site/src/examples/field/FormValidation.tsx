import { Button, Field, Input } from '@hoon-ds/react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';

interface Errors {
  name?: string;
  email?: string;
}

function validate(data: FormData): Errors {
  const name = String(data.get('name') ?? '').trim();
  const email = String(data.get('email') ?? '').trim();
  return {
    name: name ? undefined : '이름을 입력하세요.',
    email: /^\S+@\S+\.\S+$/.test(email)
      ? undefined
      : '이메일 형식이 올바르지 않습니다. 예: name@company.com',
  };
}

export default function FormValidationExample() {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate(new FormData(event.currentTarget));
    setErrors(next);
    setSubmitted(!next.name && !next.email);

    // 첫 번째 오류 필드로 포커스를 옮긴다 → 스크린리더가 레이블·오류를 함께 읽는다
    if (next.name) nameRef.current?.focus();
    else if (next.email) emailRef.current?.focus();
  };

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 360 }}
    >
      <Field.Root required invalid={!!errors.name}>
        <Field.Label>이름</Field.Label>
        <Input ref={nameRef} name="name" autoComplete="name" />
        <Field.ErrorMessage>{errors.name}</Field.ErrorMessage>
      </Field.Root>

      <Field.Root required invalid={!!errors.email}>
        <Field.Label>이메일</Field.Label>
        <Input ref={emailRef} name="email" type="email" autoComplete="email" />
        <Field.ErrorMessage>{errors.email}</Field.ErrorMessage>
      </Field.Root>

      <Button type="submit">가입하기</Button>

      {/* 제출 결과는 live region 으로 알린다 */}
      <p role="status" style={{ margin: 0 }}>
        {submitted ? '가입 요청을 보냈습니다.' : ''}
      </p>
    </form>
  );
}
