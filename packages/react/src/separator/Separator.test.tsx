import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { Separator } from './Separator';

describe('Separator', () => {
  it('기본은 장식용이라 보조기기에 노출되지 않는다', () => {
    const { container } = render(<Separator />);
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    const el = container.querySelector('.hds-separator');
    expect(el).toHaveAttribute('role', 'none');
    expect(el).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('decorative={false} 면 separator 역할을 가진다', () => {
    render(<Separator decorative={false} />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('세로 구분선은 aria-orientation 을 알린다', () => {
    render(<Separator decorative={false} orientation="vertical" />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(
      <div>
        <p>위</p>
        <Separator decorative={false} />
        <p>아래</p>
        <Separator />
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
