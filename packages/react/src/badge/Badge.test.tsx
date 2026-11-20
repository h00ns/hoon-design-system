import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { VisuallyHidden } from '../visually-hidden/VisuallyHidden';
import { Badge } from './Badge';
import type { BadgeTone, BadgeVariant } from './Badge';

const TONES: BadgeTone[] = ['neutral', 'accent', 'success', 'warning', 'danger'];
const VARIANTS: BadgeVariant[] = ['subtle', 'solid'];

describe('Badge', () => {
  it('기본값으로 neutral·subtle·md 를 data 속성에 노출한다', () => {
    render(<Badge>임시저장</Badge>);
    const badge = screen.getByText('임시저장');
    expect(badge).toHaveClass('hds-badge');
    expect(badge).toHaveAttribute('data-tone', 'neutral');
    expect(badge).toHaveAttribute('data-variant', 'subtle');
    expect(badge).toHaveAttribute('data-size', 'md');
  });

  it('인터랙티브 역할이 없다', () => {
    render(<Badge tone="success">완료</Badge>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('완료').tagName).toBe('SPAN');
  });

  it('숫자 배지는 숨김 텍스트로 맥락을 붙일 수 있다', () => {
    render(
      <button type="button">
        알림{' '}
        <Badge tone="danger" variant="solid">
          3<VisuallyHidden>개의 새 알림</VisuallyHidden>
        </Badge>
      </button>,
    );
    expect(screen.getByRole('button', { name: '알림 3개의 새 알림' })).toBeInTheDocument();
  });

  it.each(TONES.flatMap((tone) => VARIANTS.map((variant) => [tone, variant] as const)))(
    'tone=%s variant=%s 접근성 위반 없음',
    async (tone, variant) => {
      const { container } = render(
        <Badge tone={tone} variant={variant}>
          상태
        </Badge>,
      );
      await expectNoA11yViolations(container);
    },
  );
});
