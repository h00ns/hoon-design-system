import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import * as DropdownMenu from '../dropdown-menu/DropdownMenu';
import * as Breadcrumb from './Breadcrumb';

function Basic(props: { label?: string }) {
  return (
    <Breadcrumb.Root aria-label={props.label}>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">홈</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/docs">문서</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}

describe('Breadcrumb', () => {
  it('기본 이름 "현재 위치" 를 가진 내비게이션이다', () => {
    render(<Basic />);
    expect(screen.getByRole('navigation', { name: '현재 위치' })).toBeInTheDocument();
  });

  it('aria-label 로 이름을 바꿀 수 있다', () => {
    render(<Basic label="문서 경로" />);
    expect(screen.getByRole('navigation', { name: '문서 경로' })).toBeInTheDocument();
  });

  it('순서 있는 목록이며 구분자는 목록 항목 수에 포함되지 않는다', () => {
    render(<Basic />);
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  });

  it('구분자는 보조기기에서 숨긴다', () => {
    const { container } = render(<Basic />);
    container.querySelectorAll('.hds-breadcrumb__separator').forEach((sep) => {
      expect(sep).toHaveAttribute('aria-hidden', 'true');
      expect(sep).toHaveAttribute('role', 'presentation');
    });
  });

  it('현재 페이지는 링크가 아니며 aria-current="page" 를 가진다', () => {
    render(<Basic />);
    const page = screen.getByText('Breadcrumb');
    expect(page).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: 'Breadcrumb' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('Link 는 asChild 로 라우터 링크를 감싼다', () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <a href="/x" data-router="">
                라우터
              </a>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    const link = screen.getByRole('link', { name: '라우터' });
    expect(link).toHaveClass('hds-breadcrumb__link');
    expect(link).toHaveAttribute('data-router');
  });

  it('접힌 경로는 Ellipsis + DropdownMenu 로 열 수 있다', async () => {
    const user = userEvent.setup();
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">홈</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Breadcrumb.Ellipsis />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item asChild>
                  <a href="/a">설정</a>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <a href="/a/b">보안</a>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>2단계 인증</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>,
    );
    const trigger = screen.getByRole('button', { name: '숨겨진 경로 보기' });
    expect(trigger).toHaveAttribute('type', 'button');
    trigger.focus();
    await user.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    expect(
      within(menu)
        .getAllByRole('menuitem')
        .map((i) => i.textContent),
    ).toEqual(['설정', '보안']);
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(<Basic />);
    await expectNoA11yViolations(container);
  });
});
