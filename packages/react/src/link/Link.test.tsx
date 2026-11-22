import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { Link } from './Link';

describe('Link', () => {
  it('기본은 항상 밑줄 + 강조색 링크다', () => {
    render(<Link href="/docs">문서</Link>);
    const link = screen.getByRole('link', { name: '문서' });
    expect(link).toHaveClass('hds-link');
    expect(link).toHaveAttribute('data-variant', 'default');
    expect(link).toHaveAttribute('data-underline', 'always');
    expect(link).not.toHaveAttribute('target');
  });

  it('external 이면 새 창으로 열고 rel 과 안내 문구를 붙인다', () => {
    const { container } = render(
      <Link href="https://example.com" external>
        예시 사이트
      </Link>,
    );
    const link = screen.getByRole('link', { name: /^예시 사이트 ?\(새 창\)$/ });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(container.querySelector('.hds-link__icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('target="_blank" 만 줘도 외부 링크로 처리하고 rel 은 직접 준 값을 쓴다', () => {
    render(
      <Link href="https://example.com" target="_blank" rel="noopener">
        외부
      </Link>,
    );
    const link = screen.getByRole('link', { name: /^외부 ?\(새 창\)$/ });
    expect(link).toHaveAttribute('rel', 'noopener');
    expect(link).toHaveAttribute('data-external');
  });

  it('newTabLabel 로 안내 문구를 바꿀 수 있다', () => {
    render(
      <Link href="https://example.com" external newTabLabel="(opens in new tab)">
        Docs
      </Link>,
    );
    expect(screen.getByRole('link', { name: /^Docs ?\(opens in new tab\)$/ })).toBeInTheDocument();
  });

  it('asChild 로 라우터 링크를 감싸고, 외부 표시도 그 안에 들어간다', () => {
    render(
      <Link asChild variant="subtle" external>
        <a href="/x" data-router="">
          라우터
        </a>
      </Link>,
    );
    const link = screen.getByRole('link', { name: /^라우터 ?\(새 창\)$/ });
    expect(link).toHaveAttribute('data-router');
    expect(link).toHaveAttribute('data-variant', 'subtle');
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(
      <p>
        자세한 내용은 <Link href="/docs">문서</Link> 또는{' '}
        <Link href="https://example.com" external>
          외부 가이드
        </Link>
        를 본다.
      </p>,
    );
    await expectNoA11yViolations(container);
  });
});
