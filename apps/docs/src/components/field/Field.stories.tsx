import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Checkbox, Field, Input, RadioGroup, Textarea } from '@hoon-ds/react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';

const meta = {
  title: 'Components/Field',
  component: Field.Root,
  subcomponents: {
    'Field.Label': Field.Label,
    'Field.Description': Field.Description,
    'Field.ErrorMessage': Field.ErrorMessage,
  },
  args: { invalid: false, required: false, disabled: false },
  argTypes: {
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Field.Root {...args}>
        <Field.Label>이메일</Field.Label>
        <Input type="email" autoComplete="email" placeholder="name@company.com" />
        <Field.Description>로그인과 알림에 사용됩니다.</Field.Description>
        <Field.ErrorMessage>이메일 형식이 올바르지 않습니다.</Field.ErrorMessage>
      </Field.Root>
    </div>
  ),
} satisfies Meta<typeof Field.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Required: Story = { args: { required: true } };

export const Invalid: Story = { args: { invalid: true, required: true } };

export const Disabled: Story = { args: { disabled: true } };

export const Controls: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, width: 360 }}>
      <Field.Root>
        <Field.Label>문의 내용</Field.Label>
        <Textarea autoResize />
        <Field.Description>최대 500자</Field.Description>
      </Field.Root>
      <Field.Root>
        <Field.Label>배송 방법</Field.Label>
        <RadioGroup.Root defaultValue="normal">
          <RadioGroup.Item value="normal">일반 배송</RadioGroup.Item>
          <RadioGroup.Item value="fast">빠른 배송</RadioGroup.Item>
        </RadioGroup.Root>
      </Field.Root>
      <Field.Root>
        <Checkbox>마케팅 정보 수신에 동의합니다</Checkbox>
        <Field.Description>언제든 설정에서 해제할 수 있습니다.</Field.Description>
      </Field.Root>
    </div>
  ),
};

export const FormValidation: Story = {
  render: function FormStory() {
    const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
    const [submitted, setSubmitted] = useState(false);
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const name = String(data.get('name') ?? '').trim();
      const email = String(data.get('email') ?? '').trim();
      const next = {
        name: name ? undefined : '이름을 입력하세요.',
        email: /^\S+@\S+\.\S+$/.test(email)
          ? undefined
          : '이메일 형식이 올바르지 않습니다. 예: name@company.com',
      };
      setErrors(next);
      setSubmitted(!next.name && !next.email);
      // 첫 번째 오류 필드로 포커스를 옮긴다 → 스크린리더가 레이블·오류를 함께 읽는다
      if (next.name) nameRef.current?.focus();
      else if (next.email) emailRef.current?.focus();
    };

    return (
      <form noValidate onSubmit={onSubmit} style={{ display: 'grid', gap: 16, width: 320 }}>
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
        <p role="status" style={{ margin: 0 }}>
          {submitted ? '가입 요청을 보냈습니다.' : ''}
        </p>
      </form>
    );
  },
};
