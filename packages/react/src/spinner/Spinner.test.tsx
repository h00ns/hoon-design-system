import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('status 역할과 기본 레이블을 가진다', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveTextContent('불러오는 중');
  });

  it('label 을 바꿀 수 있다', () => {
    render(<Spinner label="저장 중" />);
    expect(screen.getByRole('status')).toHaveTextContent('저장 중');
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(<Spinner size="lg" />);
    await expectNoA11yViolations(container);
  });
});
