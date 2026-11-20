import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import * as Field from '../field/Field';
import { Checkbox } from './Checkbox';
import type { CheckedState } from './Checkbox';

describe('Checkbox', () => {
  it('children 을 레이블로 연결한다', () => {
    render(<Checkbox>약관 동의</Checkbox>);
    expect(screen.getByRole('checkbox', { name: '약관 동의' })).not.toBeChecked();
  });

  it('클릭·레이블 클릭·Space 로 토글된다 (비제어)', async () => {
    const user = userEvent.setup();
    render(<Checkbox>약관 동의</Checkbox>);
    const checkbox = screen.getByRole('checkbox');

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(screen.getByText('약관 동의'));
    expect(checkbox).not.toBeChecked();

    checkbox.focus();
    await user.keyboard(' ');
    expect(checkbox).toBeChecked();
  });

  it('Tab 으로 포커스되고, Enter 로는 토글되지 않는다 (APG)', async () => {
    const user = userEvent.setup();
    render(<Checkbox>동의</Checkbox>);
    await user.tab();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(checkbox).not.toBeChecked();
  });

  it('제어 컴포넌트로 동작한다', async () => {
    const onCheckedChange = vi.fn();
    function Controlled() {
      const [checked, setChecked] = React.useState<CheckedState>(false);
      return (
        <Checkbox
          checked={checked}
          onCheckedChange={(next) => {
            onCheckedChange(next);
            setChecked(next);
          }}
        >
          동의
        </Checkbox>
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('indeterminate 는 aria-checked="mixed" 로 노출된다', () => {
    render(<Checkbox checked="indeterminate">전체 선택</Checkbox>);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
  });

  it('disabled 면 토글되지 않는다', async () => {
    render(<Checkbox disabled>동의</Checkbox>);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('폼 제출 시 name/value 가 전달된다', async () => {
    let data: FormData | undefined;
    render(
      <form
        onSubmit={(e) => {
          e.preventDefault();
          data = new FormData(e.currentTarget);
        }}
      >
        <Checkbox name="terms" value="yes">
          약관
        </Checkbox>
        <Checkbox name="marketing" defaultChecked>
          마케팅
        </Checkbox>
        <button type="submit">제출</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('checkbox', { name: '약관' }));
    await userEvent.click(screen.getByRole('button', { name: '제출' }));
    expect(data?.get('terms')).toBe('yes');
    expect(data?.get('marketing')).toBe('on');
  });

  it('Field 와 연결된다', () => {
    render(
      <Field.Root invalid required>
        <Checkbox>개인정보 수집에 동의합니다</Checkbox>
        <Field.ErrorMessage>동의가 필요합니다</Field.ErrorMessage>
      </Field.Root>,
    );
    const checkbox = screen.getByRole('checkbox', { name: '개인정보 수집에 동의합니다' });
    expect(checkbox).toHaveAccessibleDescription('동의가 필요합니다');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAttribute('aria-required', 'true');
  });

  it('Field.Label 로도 이름을 줄 수 있다', () => {
    render(
      <Field.Root disabled>
        <Field.Label>알림 받기</Field.Label>
        <Checkbox />
      </Field.Root>,
    );
    expect(screen.getByRole('checkbox', { name: '알림 받기' })).toBeDisabled();
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(
      <div>
        <Checkbox>기본</Checkbox>
        <Checkbox defaultChecked>선택됨</Checkbox>
        <Checkbox checked="indeterminate">일부 선택</Checkbox>
        <Checkbox disabled>비활성</Checkbox>
        <Checkbox aria-label="레이블 없는 체크박스" />
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
