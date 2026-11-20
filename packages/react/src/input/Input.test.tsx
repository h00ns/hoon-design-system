import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import * as Field from '../field/Field';
import { Input } from './Input';

describe('Input', () => {
  describe('기본 동작', () => {
    it('textbox 로 렌더링되고 입력할 수 있다 (비제어)', async () => {
      render(<Input aria-label="이름" defaultValue="홍" />);
      const input = screen.getByRole('textbox', { name: '이름' });
      await userEvent.type(input, '길동');
      expect(input).toHaveValue('홍길동');
    });

    it('제어 컴포넌트로 동작한다', async () => {
      function Controlled() {
        const [value, setValue] = React.useState('');
        return (
          <>
            <Input
              aria-label="이름"
              value={value}
              onChange={(e) => setValue(e.target.value.toUpperCase())}
            />
            <output>{value}</output>
          </>
        );
      }
      render(<Controlled />);
      await userEvent.type(screen.getByRole('textbox'), 'abc');
      expect(screen.getByRole('textbox')).toHaveValue('ABC');
      expect(screen.getByRole('status')).toHaveTextContent('ABC');
    });

    it('ref 는 input 을, className 은 래퍼를 가리킨다', () => {
      const ref = React.createRef<HTMLInputElement>();
      const { container } = render(<Input ref={ref} aria-label="이름" className="custom" />);
      expect(ref.current).toBe(screen.getByRole('textbox'));
      expect(container.firstElementChild).toHaveClass('hds-input', 'custom');
      expect(ref.current).toHaveClass('hds-input__control');
    });

    it('type 을 전달한다 (password·search)', () => {
      const { container } = render(
        <>
          <Input aria-label="비밀번호" type="password" />
          <Input aria-label="검색" type="search" />
        </>,
      );
      expect(container.querySelector('input[type="password"]')).not.toBeNull();
      expect(screen.getByRole('searchbox', { name: '검색' })).toBeInTheDocument();
    });

    it('size·invalid·disabled·readOnly 를 래퍼 data 속성으로 노출한다', () => {
      const { container } = render(<Input aria-label="이름" size="lg" invalid disabled readOnly />);
      const root = container.firstElementChild!;
      expect(root).toHaveAttribute('data-size', 'lg');
      expect(root).toHaveAttribute('data-invalid');
      expect(root).toHaveAttribute('data-disabled');
      expect(root).toHaveAttribute('data-readonly');
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('폼 제출 시 값이 전달된다', () => {
      const onSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        return new FormData(e.currentTarget).get('email');
      });
      render(
        <form onSubmit={onSubmit}>
          <Input aria-label="이메일" name="email" defaultValue="a@b.com" />
          <button type="submit">제출</button>
        </form>,
      );
      screen.getByRole('button').click();
      expect(onSubmit).toHaveReturnedWith('a@b.com');
    });
  });

  describe('슬롯', () => {
    it('슬롯의 빈 영역을 누르면 입력에 포커스한다', async () => {
      render(<Input aria-label="금액" startSlot={<span data-testid="unit">₩</span>} />);
      await userEvent.click(screen.getByTestId('unit'));
      expect(screen.getByRole('textbox')).toHaveFocus();
    });

    it('슬롯 안 버튼은 그대로 동작하고 Tab 으로 도달할 수 있다', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Input
          aria-label="비밀번호"
          endSlot={
            <button type="button" onClick={onClick}>
              보기
            </button>
          }
        />,
      );
      await user.click(screen.getByRole('button', { name: '보기' }));
      expect(onClick).toHaveBeenCalledTimes(1);

      await user.click(screen.getByLabelText('비밀번호'));
      await user.tab();
      expect(screen.getByRole('button', { name: '보기' })).toHaveFocus();
    });
  });

  describe('Field 연결', () => {
    it('레이블·설명·오류·필수·비활성을 연결한다', () => {
      render(
        <Field.Root invalid required disabled>
          <Field.Label>이메일</Field.Label>
          <Input />
          <Field.Description>회사 메일</Field.Description>
          <Field.ErrorMessage>형식이 올바르지 않습니다</Field.ErrorMessage>
        </Field.Root>,
      );
      const input = screen.getByRole('textbox', { name: '이메일' });
      expect(input).toHaveAccessibleDescription('회사 메일 형식이 올바르지 않습니다');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toBeRequired();
      expect(input).toBeDisabled();
    });

    it('Input 이 직접 받은 값이 Field 보다 우선한다', () => {
      render(
        <Field.Root disabled>
          <Field.Label>이메일</Field.Label>
          <Input disabled={false} />
        </Field.Root>,
      );
      expect(screen.getByRole('textbox')).toBeEnabled();
    });
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(
      <div>
        <Input aria-label="기본" />
        <Input aria-label="오류" invalid />
        <Input aria-label="비활성" disabled />
        <Input aria-label="검색" type="search" startSlot={<svg aria-hidden="true" />} />
        <Field.Root invalid>
          <Field.Label>이메일</Field.Label>
          <Input />
          <Field.ErrorMessage>오류</Field.ErrorMessage>
        </Field.Root>
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
