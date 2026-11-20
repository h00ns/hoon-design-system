import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import * as DropdownMenu from './DropdownMenu';

function BasicMenu({
  onSelect = () => {},
  container,
  ...rootProps
}: DropdownMenu.DropdownMenuRootProps & {
  onSelect?: (value: string) => void;
  container?: HTMLElement | null;
}) {
  return (
    <DropdownMenu.Root {...rootProps}>
      <DropdownMenu.Trigger>옵션</DropdownMenu.Trigger>
      <DropdownMenu.Content container={container}>
        <DropdownMenu.Item onSelect={() => onSelect('edit')}>편집</DropdownMenu.Item>
        <DropdownMenu.Item onSelect={() => onSelect('copy')} aria-keyshortcuts="Meta+C">
          복사
          <DropdownMenu.Shortcut>⌘C</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item disabled onSelect={() => onSelect('share')}>
          공유
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="danger" onSelect={() => onSelect('delete')}>
          삭제
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

describe('DropdownMenu', () => {
  describe('열기·닫기', () => {
    it('트리거는 메뉴 버튼 속성을 가진다', () => {
      render(<BasicMenu />);
      const trigger = screen.getByRole('button', { name: '옵션' });
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('클릭하면 menu 가 열리고 항목을 고르면 닫힌다', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<BasicMenu onSelect={onSelect} />);
      const trigger = screen.getByRole('button', { name: '옵션' });

      await user.click(trigger);
      expect(await screen.findByRole('menu')).toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      await user.click(screen.getByRole('menuitem', { name: '편집' }));
      expect(onSelect).toHaveBeenCalledWith('edit');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  describe('키보드', () => {
    it('Enter 로 열면 첫 항목에 포커스가 가고, 화살표·Home·End 로 이동한다', async () => {
      const user = userEvent.setup();
      render(<BasicMenu />);
      await user.tab();
      await user.keyboard('{Enter}');
      await screen.findByRole('menu');

      expect(screen.getByRole('menuitem', { name: '편집' })).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('menuitem', { name: '복사' })).toHaveFocus();
      // 비활성 항목(공유)은 건너뛴다
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('menuitem', { name: '삭제' })).toHaveFocus();
      await user.keyboard('{Home}');
      expect(screen.getByRole('menuitem', { name: '편집' })).toHaveFocus();
      await user.keyboard('{End}');
      expect(screen.getByRole('menuitem', { name: '삭제' })).toHaveFocus();
    });

    it('Space·ArrowDown 으로도 열린다', async () => {
      const user = userEvent.setup();
      render(<BasicMenu />);
      await user.tab();
      await user.keyboard(' ');
      expect(await screen.findByRole('menu')).toBeInTheDocument();
      await user.keyboard('{Escape}');
      await user.keyboard('{ArrowDown}');
      expect(await screen.findByRole('menu')).toBeInTheDocument();
    });

    it('Enter 로 항목을 실행하고 포커스를 트리거로 되돌린다', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<BasicMenu onSelect={onSelect} />);
      await user.tab();
      await user.keyboard('{Enter}');
      await screen.findByRole('menu');
      await user.keyboard('{ArrowDown}{Enter}');
      expect(onSelect).toHaveBeenCalledWith('copy');
      await waitFor(() => expect(screen.getByRole('button', { name: '옵션' })).toHaveFocus());
    });

    it('Esc 로 닫고 포커스를 트리거로 되돌린다', async () => {
      const user = userEvent.setup();
      render(<BasicMenu />);
      await user.tab();
      await user.keyboard('{Enter}');
      await screen.findByRole('menu');
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: '옵션' })).toHaveFocus();
    });

    it('글자를 입력하면 일치하는 항목으로 이동한다 (typeahead)', async () => {
      const user = userEvent.setup();
      render(<BasicMenu />);
      await user.tab();
      await user.keyboard('{Enter}');
      await screen.findByRole('menu');
      await user.keyboard('삭');
      expect(screen.getByRole('menuitem', { name: '삭제' })).toHaveFocus();
    });
  });

  describe('항목 종류', () => {
    it('비활성 항목은 aria-disabled 로 노출되고 실행되지 않는다', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<BasicMenu onSelect={onSelect} />);
      await user.click(screen.getByRole('button', { name: '옵션' }));
      const share = await screen.findByRole('menuitem', { name: '공유' });
      expect(share).toHaveAttribute('aria-disabled', 'true');
      await user.click(share);
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('danger 항목은 data-variant 를 가진다', async () => {
      const user = userEvent.setup();
      render(<BasicMenu />);
      await user.click(screen.getByRole('button', { name: '옵션' }));
      expect(await screen.findByRole('menuitem', { name: '삭제' })).toHaveAttribute(
        'data-variant',
        'danger',
      );
    });

    it('단축키 표시는 보조기기에서 숨기고 aria-keyshortcuts 로 전달한다', async () => {
      const user = userEvent.setup();
      render(<BasicMenu />);
      await user.click(screen.getByRole('button', { name: '옵션' }));
      const copy = await screen.findByRole('menuitem', { name: '복사' });
      expect(copy).toHaveAttribute('aria-keyshortcuts', 'Meta+C');
      expect(screen.getByText('⌘C')).toHaveAttribute('aria-hidden', 'true');
    });

    it('CheckboxItem 은 menuitemcheckbox 로 상태를 토글한다', async () => {
      const user = userEvent.setup();
      function Menu() {
        const [checked, setChecked] = React.useState(false);
        return (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>보기</DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.CheckboxItem checked={checked} onCheckedChange={setChecked}>
                격자 표시
              </DropdownMenu.CheckboxItem>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        );
      }
      render(<Menu />);
      await user.click(screen.getByRole('button', { name: '보기' }));
      const item = await screen.findByRole('menuitemcheckbox', { name: '격자 표시' });
      expect(item).toHaveAttribute('aria-checked', 'false');
      await user.click(item);
      await user.click(screen.getByRole('button', { name: '보기' }));
      expect(await screen.findByRole('menuitemcheckbox', { name: '격자 표시' })).toHaveAttribute(
        'aria-checked',
        'true',
      );
    });

    it('RadioItem 은 menuitemradio 로 하나만 선택한다', async () => {
      const user = userEvent.setup();
      function Menu() {
        const [sort, setSort] = React.useState('new');
        return (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>정렬</DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.RadioGroup value={sort} onValueChange={setSort}>
                <DropdownMenu.RadioItem value="new">최신순</DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value="popular">인기순</DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        );
      }
      render(<Menu />);
      await user.click(screen.getByRole('button', { name: '정렬' }));
      expect(await screen.findByRole('menuitemradio', { name: '최신순' })).toHaveAttribute(
        'aria-checked',
        'true',
      );
      await user.click(screen.getByRole('menuitemradio', { name: '인기순' }));
      await user.click(screen.getByRole('button', { name: '정렬' }));
      expect(await screen.findByRole('menuitemradio', { name: '인기순' })).toHaveAttribute(
        'aria-checked',
        'true',
      );
      expect(screen.getByRole('menuitemradio', { name: '최신순' })).toHaveAttribute(
        'aria-checked',
        'false',
      );
    });

    it('하위 메뉴는 ArrowRight 로 열고 ArrowLeft 로 닫는다', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>더보기</DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>내보내기</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item>PDF</DropdownMenu.Item>
                <DropdownMenu.Item>CSV</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu.Root>,
      );
      await user.tab();
      await user.keyboard('{Enter}');
      const subTrigger = await screen.findByRole('menuitem', { name: '내보내기' });
      expect(subTrigger).toHaveAttribute('aria-haspopup', 'menu');
      expect(subTrigger).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      await waitFor(() => expect(screen.getByRole('menuitem', { name: 'PDF' })).toHaveFocus());
      await user.keyboard('{ArrowLeft}');
      await waitFor(() => expect(screen.queryByRole('menuitem', { name: 'PDF' })).toBeNull());
      expect(subTrigger).toHaveFocus();
    });
  });

  describe('접근성 (axe)', () => {
    it('닫힌 상태 위반 없음', async () => {
      const { container } = render(<BasicMenu />);
      await expectNoA11yViolations(container);
    });

    it('열린 상태 위반 없음', async () => {
      const user = userEvent.setup();
      function InMain() {
        const [main, setMain] = React.useState<HTMLElement | null>(null);
        return (
          <main ref={setMain}>
            <BasicMenu container={main} />
          </main>
        );
      }
      const { container } = render(<InMain />);
      await user.click(screen.getByRole('button', { name: '옵션' }));
      await screen.findByRole('menu');
      await expectNoA11yViolations(container);
    });
  });
});
