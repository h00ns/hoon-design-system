import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('항상 보조기기에서 숨긴다', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstChild).toHaveAttribute('data-shape', 'rect');
  });

  it('숫자 크기는 px 로, 문자열은 그대로 적용한다', () => {
    const { container } = render(<Skeleton width={120} height="2rem" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('120px');
    expect(el.style.height).toBe('2rem');
  });

  it('circle 은 한 변만 주어도 정원이 된다', () => {
    const { container } = render(<Skeleton shape="circle" width={48} />);
    expect(container.firstChild).toHaveStyle({ width: '48px', height: '48px' });
  });

  it('text + lines 는 여러 줄을 그리고 마지막 줄을 표시한다', () => {
    const { container } = render(<Skeleton shape="text" lines={3} />);
    const group = container.firstChild as HTMLElement;
    expect(group).toHaveClass('hds-skeleton-group');
    expect(group).toHaveAttribute('aria-hidden', 'true');
    const lines = group.querySelectorAll('.hds-skeleton');
    expect(lines).toHaveLength(3);
    expect(lines[2]).toHaveAttribute('data-last');
    expect(lines[0]).not.toHaveAttribute('data-last');
  });

  it('로딩 영역과 함께 쓸 때 접근성 위반 없음', async () => {
    const { container } = render(
      <section aria-busy="true" aria-label="프로필">
        <Skeleton shape="circle" width={40} />
        <Skeleton shape="text" lines={2} />
        <p role="status">프로필을 불러오는 중</p>
      </section>,
    );
    await expectNoA11yViolations(container);
  });
});
