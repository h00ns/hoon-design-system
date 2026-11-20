import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import * as Field from './Field';
import { useFieldControl } from './field-context';
import type { FieldControlProps } from './field-context';

/** Field 연결을 검증하기 위한 최소 컨트롤 */
function TestInput(props: FieldControlProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const control = useFieldControl(props);
  return <input {...props} {...control} />;
}

function TestGroup(props: FieldControlProps) {
  const control = useFieldControl(props, { labelledBy: true });
  return <div role="radiogroup" {...control} />;
}

describe('Field', () => {
  it('레이블을 컨트롤에 연결한다', () => {
    render(
      <Field.Root>
        <Field.Label>이메일</Field.Label>
        <TestInput />
      </Field.Root>,
    );
    expect(screen.getByRole('textbox', { name: '이메일' })).toBeInTheDocument();
  });

  it('레이블을 클릭하면 컨트롤로 포커스가 간다', async () => {
    render(
      <Field.Root>
        <Field.Label>이메일</Field.Label>
        <TestInput />
      </Field.Root>,
    );
    await userEvent.click(screen.getByText('이메일'));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('설명을 aria-describedby 로 연결한다', () => {
    render(
      <Field.Root>
        <Field.Label>비밀번호</Field.Label>
        <TestInput />
        <Field.Description>8자 이상</Field.Description>
      </Field.Root>,
    );
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('8자 이상');
  });

  it('invalid 이면 aria-invalid 와 오류 메시지를 연결한다', () => {
    render(
      <Field.Root invalid>
        <Field.Label>이메일</Field.Label>
        <TestInput />
        <Field.Description>회사 메일</Field.Description>
        <Field.ErrorMessage>형식이 올바르지 않습니다</Field.ErrorMessage>
      </Field.Root>,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('회사 메일 형식이 올바르지 않습니다');
  });

  it('invalid 가 아니면 오류 메시지를 렌더링하지 않고 연결도 하지 않는다', () => {
    render(
      <Field.Root>
        <Field.Label>이메일</Field.Label>
        <TestInput />
        <Field.ErrorMessage>형식이 올바르지 않습니다</Field.ErrorMessage>
      </Field.Root>,
    );
    expect(screen.queryByText('형식이 올바르지 않습니다')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('invalid 를 해제하면 오류 연결을 끊는다', () => {
    const ui = (invalid: boolean) => (
      <Field.Root invalid={invalid}>
        <Field.Label>이메일</Field.Label>
        <TestInput />
        <Field.ErrorMessage>오류</Field.ErrorMessage>
      </Field.Root>
    );
    const { rerender } = render(ui(true));
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('오류');
    rerender(ui(false));
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
  });

  it('required·disabled 를 컨트롤에 전달하고, 필수 기호는 보조기기에서 숨긴다', () => {
    render(
      <Field.Root required disabled>
        <Field.Label>이름</Field.Label>
        <TestInput />
      </Field.Root>,
    );
    const input = screen.getByRole('textbox', { name: '이름' });
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('컨트롤이 직접 받은 id 를 쓰면 레이블도 따라간다', () => {
    render(
      <Field.Root>
        <Field.Label>이메일</Field.Label>
        <TestInput id="custom-email" />
      </Field.Root>,
    );
    const input = screen.getByRole('textbox', { name: '이메일' });
    expect(input).toHaveAttribute('id', 'custom-email');
  });

  it('컨트롤이 직접 받은 aria-describedby 와 합친다', () => {
    render(
      <>
        <p id="extra">추가 설명</p>
        <Field.Root>
          <Field.Label>이메일</Field.Label>
          <TestInput aria-describedby="extra" />
          <Field.Description>설명</Field.Description>
        </Field.Root>
      </>,
    );
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('추가 설명 설명');
  });

  it('labelledBy 옵션이면 aria-labelledby 로 레이블을 연결한다', () => {
    render(
      <Field.Root>
        <Field.Label>배송 방법</Field.Label>
        <TestGroup />
      </Field.Root>,
    );
    expect(screen.getByRole('radiogroup', { name: '배송 방법' })).toBeInTheDocument();
  });

  it('Field 밖에서는 props 를 그대로 쓴다', () => {
    render(<TestInput aria-label="검색" />);
    const input = screen.getByRole('textbox', { name: '검색' });
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input.id).not.toBe('');
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(
      <Field.Root invalid required>
        <Field.Label>이메일</Field.Label>
        <TestInput />
        <Field.Description>회사 메일</Field.Description>
        <Field.ErrorMessage>형식이 올바르지 않습니다</Field.ErrorMessage>
      </Field.Root>,
    );
    await expectNoA11yViolations(container);
  });
});
