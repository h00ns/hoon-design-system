import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { Button } from './Button';
import type { ButtonSize, ButtonVariant } from './Button';

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger'];
const SIZES: ButtonSize[] = ['sm', 'md', 'lg'];

describe('Button', () => {
  describe('기본 동작', () => {
    it('접근 가능한 이름을 가진 button 역할로 렌더링된다', () => {
      render(<Button>저장</Button>);
      expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
    });

    it('기본 type 은 button 이라 폼을 의도치 않게 제출하지 않는다', async () => {
      const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
      render(
        <form onSubmit={onSubmit}>
          <Button>취소</Button>
        </form>,
      );
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
      await userEvent.click(screen.getByRole('button'));
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('type="submit" 이면 폼을 제출한다', async () => {
      const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
      render(
        <form onSubmit={onSubmit}>
          <Button type="submit">제출</Button>
        </form>,
      );
      await userEvent.click(screen.getByRole('button'));
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('variant·size 를 data 속성으로 노출한다', () => {
      render(
        <Button variant="danger" size="lg">
          삭제
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'danger');
      expect(button).toHaveAttribute('data-size', 'lg');
      expect(button).toHaveClass('hds-button');
    });

    it('className 을 병합하고 ref 를 전달한다', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <Button ref={ref} className="custom">
          확인
        </Button>,
      );
      expect(ref.current).toBe(screen.getByRole('button'));
      expect(ref.current).toHaveClass('hds-button', 'custom');
    });
  });

  describe('키보드', () => {
    it('Tab 으로 포커스되고 Enter·Space 로 실행된다', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>실행</Button>);

      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();

      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      expect(onClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('disabled', () => {
    it('네이티브 disabled 로 클릭과 포커스를 막는다', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          저장
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();

      await user.click(button);
      await user.tab();
      expect(onClick).not.toHaveBeenCalled();
      expect(button).not.toHaveFocus();
    });

    it('focusableWhenDisabled 이면 포커스는 유지하되 실행되지 않는다', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button disabled focusableWhenDisabled onClick={onClick}>
          저장
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('disabled');
      expect(button).toHaveAttribute('aria-disabled', 'true');

      await user.tab();
      expect(button).toHaveFocus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      await user.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('aria-disabled 를 직접 넘겨도 비활성으로 동작한다', async () => {
      const onClick = vi.fn();
      render(
        <Button aria-disabled="true" onClick={onClick}>
          저장
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      await userEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('비활성 submit 버튼은 폼을 제출하지 않는다', async () => {
      const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
      render(
        <form onSubmit={onSubmit}>
          <Button type="submit" disabled focusableWhenDisabled>
            제출
          </Button>
        </form>,
      );
      await userEvent.click(screen.getByRole('button'));
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('loading', () => {
    it('aria-busy·aria-disabled 를 걸고 클릭을 막는다', async () => {
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          저장
        </Button>,
      );
      const button = screen.getByRole('button', { name: '저장' });
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveAttribute('data-loading');
      await userEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('로딩으로 바뀌어도 포커스를 잃지 않는다', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<Button>저장</Button>);
      await user.tab();
      rerender(<Button loading>저장</Button>);
      // 브라우저는 네이티브 disabled 가 되면 포커스를 body 로 날린다 → disabled 를 쓰지 않아야 한다
      // (jsdom 은 이 동작을 재현하지 않으므로 속성으로 직접 검증)
      expect(screen.getByRole('button')).not.toHaveAttribute('disabled');
      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('스피너는 보조기기에서 숨긴다', () => {
      const { container } = render(<Button loading>저장</Button>);
      expect(container.querySelector('.hds-button__spinner')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });

    it('loading 과 disabled 가 함께면 포커스를 유지한다', async () => {
      const user = userEvent.setup();
      render(
        <Button loading disabled>
          저장
        </Button>,
      );
      expect(screen.getByRole('button')).not.toHaveAttribute('disabled');
      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();
    });
  });

  describe('asChild', () => {
    it('자식 요소(링크)를 루트로 렌더링하고 type 을 붙이지 않는다', () => {
      render(
        <Button asChild variant="secondary">
          <a href="/docs">문서 보기</a>
        </Button>,
      );
      const link = screen.getByRole('link', { name: '문서 보기' });
      expect(link).toHaveClass('hds-button');
      expect(link).toHaveAttribute('data-variant', 'secondary');
      expect(link).not.toHaveAttribute('type');
    });

    it('비활성 링크는 aria-disabled 로 표현하고 이동을 막는다', async () => {
      const onClick = vi.fn();
      render(
        <Button asChild disabled>
          <a href="/docs" onClick={onClick}>
            문서 보기
          </a>
        </Button>,
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).not.toHaveAttribute('disabled');

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      link.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('asChild + loading 이면 스피너를 자식 안에 렌더링한다', () => {
      render(
        <Button asChild loading>
          <a href="/docs">문서 보기</a>
        </Button>,
      );
      const link = screen.getByRole('link', { name: '문서 보기' });
      expect(link.querySelector('.hds-button__spinner')).not.toBeNull();
    });
  });

  describe('접근성 (axe)', () => {
    it.each(VARIANTS)('variant=%s 위반 없음', async (variant) => {
      const { container } = render(<Button variant={variant}>버튼</Button>);
      await expectNoA11yViolations(container);
    });

    it.each(SIZES)('size=%s 위반 없음', async (size) => {
      const { container } = render(<Button size={size}>버튼</Button>);
      await expectNoA11yViolations(container);
    });

    it('disabled·loading·focusableWhenDisabled·asChild 위반 없음', async () => {
      const { container } = render(
        <div>
          <Button disabled>비활성</Button>
          <Button disabled focusableWhenDisabled>
            포커스 가능 비활성
          </Button>
          <Button loading>로딩</Button>
          <Button asChild>
            <a href="/docs">링크</a>
          </Button>
        </div>,
      );
      await expectNoA11yViolations(container);
    });

    it('아이콘 전용 버튼은 aria-label 로 이름을 가진다', async () => {
      const { container } = render(
        <Button aria-label="닫기">
          <svg aria-hidden="true" viewBox="0 0 16 16" />
        </Button>,
      );
      expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
      await expectNoA11yViolations(container);
    });
  });
});
