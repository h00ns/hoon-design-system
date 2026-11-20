import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { IconButton } from './IconButton';

const Icon = () => <svg viewBox="0 0 16 16" />;

describe('IconButton', () => {
  it('aria-label 을 접근 가능한 이름으로 쓰고 아이콘은 숨긴다', () => {
    const { container } = render(
      <IconButton aria-label="닫기">
        <Icon />
      </IconButton>,
    );
    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    expect(container.querySelector('.hds-icon-button__icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('기본 variant 는 ghost', () => {
    render(
      <IconButton aria-label="닫기">
        <Icon />
      </IconButton>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'ghost');
  });

  it('Button 동작(클릭, loading)을 그대로 가진다', async () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <IconButton aria-label="새로고침" onClick={onClick}>
        <Icon />
      </IconButton>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <IconButton aria-label="새로고침" onClick={onClick} loading>
        <Icon />
      </IconButton>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: '새로고침' })).toHaveAttribute('aria-busy', 'true');
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(
      <IconButton aria-label="설정">
        <Icon />
      </IconButton>,
    );
    await expectNoA11yViolations(container);
  });
});
