import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { Avatar, getInitials } from './Avatar';

describe('getInitials', () => {
  it.each([
    ['홍길동', '길동'],
    ['남궁민수', '민수'],
    ['이산', '이산'],
    ['김', '김'],
    ['Jane Doe', 'JD'],
    ['jane', 'J'],
    ['Mary Jane Watson', 'MW'],
    ['  공백  ', '공백'],
    ['', ''],
  ])('%s → %s', (name, expected) => {
    expect(getInitials(name)).toBe(expected);
  });
});

describe('Avatar', () => {
  it('이미지가 없으면 이니셜을 보여주고 name 을 접근 가능한 이름으로 쓴다', () => {
    render(<Avatar name="홍길동" />);
    const img = screen.getByRole('img', { name: '홍길동' });
    expect(img).toHaveTextContent('길동');
  });

  it('alt 가 name 보다 우선한다', () => {
    render(<Avatar name="홍길동" alt="홍길동 프로필" />);
    expect(screen.getByRole('img', { name: '홍길동 프로필' })).toBeInTheDocument();
  });

  it('alt="" 면 장식으로 처리해 보조기기에서 숨긴다', () => {
    const { container } = render(<Avatar name="홍길동" alt="" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('.hds-avatar__fallback')).toHaveAttribute('aria-hidden', 'true');
  });

  it('이름도 alt 도 없으면 기본 아이콘을 장식으로 보여준다', () => {
    const { container } = render(<Avatar />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('fallback 으로 대체 내용을 바꾼다', () => {
    render(<Avatar name="디자인팀" fallback="DS" />);
    expect(screen.getByRole('img', { name: '디자인팀' })).toHaveTextContent('DS');
  });

  it('size·shape 를 data 속성으로 노출한다', () => {
    const { container } = render(<Avatar name="무신사" size="lg" shape="square" />);
    const root = container.querySelector('.hds-avatar');
    expect(root).toHaveAttribute('data-size', 'lg');
    expect(root).toHaveAttribute('data-shape', 'square');
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(
      <div>
        <Avatar name="홍길동" />
        <Avatar name="Jane Doe" size="sm" />
        <Avatar alt="" name="장식" />
        <Avatar />
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
