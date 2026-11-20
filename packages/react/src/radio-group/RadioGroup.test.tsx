import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import * as Field from '../field/Field';
import * as RadioGroup from './RadioGroup';

/**
 * Radix 는 화살표 keydown 후 setTimeout 으로 포커스를 옮기고, 그때 키가 눌려 있으면 선택한다.
 * 실제 브라우저처럼 "누른 채 → 포커스 이동 → 뗌" 순서를 재현한다.
 */
async function pressArrow(user: ReturnType<typeof userEvent.setup>, key: string) {
  await user.keyboard(`{${key}>}`);
  await user.keyboard(`{/${key}}`);
}

function Shipping(props: RadioGroup.RadioGroupRootProps) {
  return (
    <RadioGroup.Root aria-label="배송 방법" {...props}>
      <RadioGroup.Item value="normal">일반 배송</RadioGroup.Item>
      <RadioGroup.Item value="fast" description="오늘 주문 시 내일 도착">
        빠른 배송
      </RadioGroup.Item>
      <RadioGroup.Item value="pickup" disabled>
        매장 픽업
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
}

describe('RadioGroup', () => {
  it('radiogroup 과 레이블 있는 radio 들로 렌더링된다', () => {
    render(<Shipping />);
    expect(screen.getByRole('radiogroup', { name: '배송 방법' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: '빠른 배송' })).toHaveAccessibleDescription(
      '오늘 주문 시 내일 도착',
    );
  });

  it('선택이 없으면 Tab 은 첫 항목으로, 선택이 있으면 선택된 항목으로 간다', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Shipping />);
    await user.tab();
    expect(screen.getByRole('radio', { name: '일반 배송' })).toHaveFocus();
    unmount();

    render(<Shipping defaultValue="fast" />);
    await user.tab();
    expect(screen.getByRole('radio', { name: '빠른 배송' })).toHaveFocus();
  });

  it('화살표 키로 이동하며 선택하고, 비활성 항목은 건너뛰며 순환한다 (APG)', async () => {
    const user = userEvent.setup();
    render(<Shipping defaultValue="normal" />);
    await user.tab();

    await pressArrow(user, 'ArrowDown');
    expect(screen.getByRole('radio', { name: '빠른 배송' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: '빠른 배송' })).toBeChecked();

    // 매장 픽업(비활성)을 건너뛰고 처음으로 돌아간다
    await pressArrow(user, 'ArrowDown');
    expect(screen.getByRole('radio', { name: '일반 배송' })).toBeChecked();

    await pressArrow(user, 'ArrowUp');
    expect(screen.getByRole('radio', { name: '빠른 배송' })).toBeChecked();
  });

  it('orientation 과 관계없이 좌우·상하 화살표가 모두 동작한다', async () => {
    const user = userEvent.setup();
    render(<Shipping defaultValue="normal" orientation="horizontal" />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('data-orientation', 'horizontal');
    await user.tab();
    await pressArrow(user, 'ArrowRight');
    expect(screen.getByRole('radio', { name: '빠른 배송' })).toBeChecked();
    await pressArrow(user, 'ArrowUp');
    expect(screen.getByRole('radio', { name: '일반 배송' })).toBeChecked();
    await pressArrow(user, 'ArrowDown');
    expect(screen.getByRole('radio', { name: '빠른 배송' })).toBeChecked();
  });

  it('Tab 은 그룹을 빠져나간다 (그룹 전체가 탭 정지 하나)', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Shipping defaultValue="normal" />
        <button type="button">다음</button>
      </>,
    );
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: '다음' })).toHaveFocus();
  });

  it('레이블 클릭으로 선택하고, 제어 컴포넌트로 동작한다', async () => {
    const onValueChange = vi.fn();
    function Controlled() {
      const [value, setValue] = React.useState('normal');
      return (
        <Shipping
          value={value}
          onValueChange={(v) => {
            onValueChange(v);
            setValue(v);
          }}
        />
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByText('빠른 배송'));
    expect(onValueChange).toHaveBeenCalledWith('fast');
    expect(screen.getByRole('radio', { name: '빠른 배송' })).toBeChecked();
  });

  it('비활성 항목은 선택되지 않는다', async () => {
    render(<Shipping />);
    await userEvent.click(screen.getByRole('radio', { name: '매장 픽업' }));
    expect(screen.getByRole('radio', { name: '매장 픽업' })).not.toBeChecked();
  });

  it('폼 제출 시 선택값이 전달된다', async () => {
    let data: FormData | undefined;
    render(
      <form
        onSubmit={(e) => {
          e.preventDefault();
          data = new FormData(e.currentTarget);
        }}
      >
        <Shipping name="shipping" defaultValue="fast" />
        <button type="submit">제출</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: '제출' }));
    expect(data?.get('shipping')).toBe('fast');
  });

  it('Field.Label 을 aria-labelledby 로, 오류를 aria-describedby 로 연결한다', () => {
    render(
      <Field.Root invalid required>
        <Field.Label>결제 수단</Field.Label>
        <RadioGroup.Root>
          <RadioGroup.Item value="card">카드</RadioGroup.Item>
          <RadioGroup.Item value="bank">계좌이체</RadioGroup.Item>
        </RadioGroup.Root>
        <Field.ErrorMessage>결제 수단을 선택하세요</Field.ErrorMessage>
      </Field.Root>,
    );
    const group = screen.getByRole('radiogroup', { name: '결제 수단' });
    expect(group).toHaveAccessibleDescription('결제 수단을 선택하세요');
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAttribute('aria-required', 'true');
  });

  it('Field disabled 면 모든 항목이 비활성', () => {
    render(
      <Field.Root disabled>
        <Field.Label>결제 수단</Field.Label>
        <RadioGroup.Root>
          <RadioGroup.Item value="card">카드</RadioGroup.Item>
        </RadioGroup.Root>
      </Field.Root>,
    );
    expect(screen.getByRole('radio', { name: '카드' })).toBeDisabled();
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(<Shipping defaultValue="fast" />);
    await expectNoA11yViolations(container);
  });
});
