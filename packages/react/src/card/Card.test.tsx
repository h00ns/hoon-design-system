import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import * as Card from './Card';

describe('Card', () => {
  it('variant·padding 을 data 속성으로 노출하고 기본 제목은 h3 다', () => {
    const { container } = render(
      <Card.Root variant="elevated" padding="lg">
        <Card.Header>
          <Card.Title>요금제</Card.Title>
          <Card.Description>월 단위 결제</Card.Description>
        </Card.Header>
        <Card.Body>내용</Card.Body>
        <Card.Footer>푸터</Card.Footer>
      </Card.Root>,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('hds-card');
    expect(root).toHaveAttribute('data-variant', 'elevated');
    expect(root).toHaveAttribute('data-padding', 'lg');
    expect(screen.getByRole('heading', { level: 3, name: '요금제' })).toBeInTheDocument();
  });

  it('asChild 로 루트와 제목 요소를 바꿀 수 있다', () => {
    render(
      <ul>
        <Card.Root asChild>
          <li>
            <Card.Title asChild>
              <h2>제목</h2>
            </Card.Title>
          </li>
        </Card.Root>
      </ul>,
    );
    expect(screen.getByRole('listitem')).toHaveClass('hds-card');
    expect(screen.getByRole('heading', { level: 2, name: '제목' })).toHaveClass('hds-card__title');
  });

  describe('interactive', () => {
    const InteractiveCard = ({ onAction }: { onAction?: () => void }) => (
      <Card.Root interactive>
        <Card.Header>
          <Card.Title>
            <Card.Link href="/posts/1">접근성 체크리스트</Card.Link>
          </Card.Title>
          <Card.Description>배포 전에 확인할 것</Card.Description>
        </Card.Header>
        <Card.Footer>
          <button type="button" onClick={onAction}>
            저장
          </button>
        </Card.Footer>
      </Card.Root>
    );

    it('카드 전체가 아니라 대표 링크 하나만 링크 역할을 가진다', () => {
      render(<InteractiveCard />);
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAccessibleName('접근성 체크리스트');
      expect(links[0]).toHaveAttribute('href', '/posts/1');
      expect(links[0]!.closest('.hds-card')).toHaveAttribute('data-interactive');
    });

    it('카드 안의 다른 버튼은 따로 동작하고 Tab 순서도 링크 → 버튼이다', async () => {
      const user = userEvent.setup();
      const onAction = vi.fn();
      render(<InteractiveCard onAction={onAction} />);

      await user.tab();
      expect(screen.getByRole('link')).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: '저장' })).toHaveFocus();

      await user.click(screen.getByRole('button', { name: '저장' }));
      expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('Card.Link 는 asChild 로 라우터 링크를 감쌀 수 있다', () => {
      render(
        <Card.Root interactive>
          <Card.Title>
            <Card.Link asChild>
              <a href="/a" data-router="">
                라우터 링크
              </a>
            </Card.Link>
          </Card.Title>
        </Card.Root>,
      );
      const link = screen.getByRole('link', { name: '라우터 링크' });
      expect(link).toHaveClass('hds-card__link');
      expect(link).toHaveAttribute('data-router');
    });

    it('접근성 위반 없음', async () => {
      const { container } = render(<InteractiveCard />);
      await expectNoA11yViolations(container);
    });
  });

  it('variant 별 접근성 위반 없음', async () => {
    const { container } = render(
      <div>
        {(['outline', 'elevated', 'subtle'] as const).map((variant) => (
          <Card.Root key={variant} variant={variant}>
            <Card.Title>{variant}</Card.Title>
            <Card.Body>내용</Card.Body>
          </Card.Root>
        ))}
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
