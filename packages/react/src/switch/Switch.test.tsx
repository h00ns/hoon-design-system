import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import * as Field from '../field/Field';
import { Switch } from './Switch';

describe('Switch', () => {
  it('switch 역할과 레이블을 가진다', () => {
    render(<Switch>알림 받기</Switch>);
    const sw = screen.getByRole('switch', { name: '알림 받기' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });

  it('클릭·레이블 클릭·Space·Enter 로 토글된다', async () => {
    const user = userEvent.setup();
    render(<Switch>알림 받기</Switch>);
    const sw = screen.getByRole('switch');

    await user.click(sw);
    expect(sw).toBeChecked();
    await user.click(screen.getByText('알림 받기'));
    expect(sw).not.toBeChecked();

    sw.focus();
    await user.keyboard(' ');
    expect(sw).toBeChecked();
    await user.keyboard('{Enter}');
    expect(sw).not.toBeChecked();
  });

  it('제어 컴포넌트로 동작한다', async () => {
    const onCheckedChange = vi.fn();
    function Controlled() {
      const [on, setOn] = React.useState(true);
      return (
        <Switch
          checked={on}
          onCheckedChange={(next) => {
            onCheckedChange(next);
            setOn(next);
          }}
        >
          다크 모드
        </Switch>
      );
    }
    render(<Controlled />);
    expect(screen.getByRole('switch')).toBeChecked();
    await userEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('disabled 면 토글되지 않는다', async () => {
    render(<Switch disabled>알림</Switch>);
    await userEvent.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).not.toBeChecked();
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('size·labelPosition 을 data 속성으로 노출한다', () => {
    const { container } = render(
      <Switch size="sm" labelPosition="start">
        알림
      </Switch>,
    );
    expect(container.firstElementChild).toHaveAttribute('data-size', 'sm');
    expect(container.firstElementChild).toHaveAttribute('data-label-position', 'start');
  });

  it('폼 제출 시 값이 전달된다', async () => {
    let data: FormData | undefined;
    render(
      <form
        onSubmit={(e) => {
          e.preventDefault();
          data = new FormData(e.currentTarget);
        }}
      >
        <Switch name="notify" defaultChecked>
          알림
        </Switch>
        <Switch name="newsletter">뉴스레터</Switch>
        <button type="submit">저장</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: '저장' }));
    expect(data?.get('notify')).toBe('on');
    expect(data?.has('newsletter')).toBe(false);
  });

  it('Field 와 연결된다', () => {
    render(
      <Field.Root disabled>
        <Field.Label>자동 저장</Field.Label>
        <Switch />
        <Field.Description>변경 사항을 1분마다 저장합니다</Field.Description>
      </Field.Root>,
    );
    const sw = screen.getByRole('switch', { name: '자동 저장' });
    expect(sw).toHaveAccessibleDescription('변경 사항을 1분마다 저장합니다');
    expect(sw).toBeDisabled();
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(
      <div>
        <Switch>기본</Switch>
        <Switch defaultChecked size="sm">
          작게
        </Switch>
        <Switch disabled>비활성</Switch>
        <Switch aria-label="레이블 없음" />
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
