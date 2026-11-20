import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('보조기기에는 노출된다', () => {
    render(
      <button type="button">
        <svg aria-hidden="true" />
        <VisuallyHidden>메뉴 열기</VisuallyHidden>
      </button>,
    );
    expect(screen.getByRole('button', { name: '메뉴 열기' })).toBeInTheDocument();
  });

  it('asChild 로 링크를 숨김 처리하고 focusable 표시를 단다', () => {
    render(
      <VisuallyHidden asChild focusable>
        <a href="#main">본문 바로가기</a>
      </VisuallyHidden>,
    );
    const link = screen.getByRole('link', { name: '본문 바로가기' });
    expect(link).toHaveClass('hds-visually-hidden');
    expect(link).toHaveAttribute('data-focusable');
  });
});
