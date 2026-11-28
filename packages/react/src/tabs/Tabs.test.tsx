import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import * as Tabs from './Tabs';

function BasicTabs(props: Tabs.TabsRootProps) {
  return (
    <Tabs.Root defaultValue="account" {...props}>
      <Tabs.List aria-label="설정">
        <Tabs.Trigger value="account">계정</Tabs.Trigger>
        <Tabs.Trigger value="password">비밀번호</Tabs.Trigger>
        <Tabs.Trigger value="billing" disabled>
          결제
        </Tabs.Trigger>
        <Tabs.Trigger value="alerts">알림</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">계정 패널</Tabs.Content>
      <Tabs.Content value="password">비밀번호 패널</Tabs.Content>
      <Tabs.Content value="billing">결제 패널</Tabs.Content>
      <Tabs.Content value="alerts">알림 패널</Tabs.Content>
    </Tabs.Root>
  );
}

describe('Tabs', () => {
  it('tablist·tab·tabpanel 역할과 연결을 가진다', () => {
    render(<BasicTabs />);
    expect(screen.getByRole('tablist', { name: '설정' })).toBeInTheDocument();
    const tab = screen.getByRole('tab', { name: '계정' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    const panel = screen.getByRole('tabpanel', { name: '계정' });
    expect(panel).toHaveTextContent('계정 패널');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
  });

  it('variant 를 data 속성으로 노출한다', () => {
    const { container } = render(<BasicTabs variant="segmented" />);
    expect(container.querySelector('.hds-tabs')).toHaveAttribute('data-variant', 'segmented');
  });

  it('선택 표시(indicator)는 보조기기에서 숨기고, 탭을 바꾸면 새 탭 위치로 다시 잰다', async () => {
    const user = userEvent.setup();
    render(<BasicTabs />);
    const list = screen.getByRole('tablist');
    const indicator = list.querySelector('.hds-tabs__indicator') as HTMLElement;
    expect(indicator).toHaveAttribute('aria-hidden', 'true');
    expect(list).toHaveAttribute('data-indicator');
    // 탭 목록 안의 탭은 여전히 탭 역할 요소만 보인다
    expect(screen.getAllByRole('tab')).toHaveLength(
      list.querySelectorAll('.hds-tabs__trigger').length,
    );

    const tabs = screen.getAllByRole('tab');
    Object.defineProperty(tabs[1], 'offsetLeft', { configurable: true, value: 120 });
    await user.click(tabs[1]!);
    await waitFor(() => expect(indicator.style.getPropertyValue('--_ind-x')).toBe('120px'));
  });

  it('목록이 Root 의 직계 자식이 아니어도 variant 를 받는다', () => {
    render(
      <Tabs.Root defaultValue="a" variant="segmented">
        <header>
          <Tabs.List aria-label="대상">
            <Tabs.Trigger value="a">개인</Tabs.Trigger>
            <Tabs.Trigger value="b">팀</Tabs.Trigger>
          </Tabs.List>
        </header>
        <Tabs.Content value="a">개인 설정</Tabs.Content>
        <Tabs.Content value="b">팀 설정</Tabs.Content>
      </Tabs.Root>,
    );
    expect(screen.getByRole('tablist')).toHaveAttribute('data-variant', 'segmented');
  });

  it('클릭하면 탭이 바뀐다', async () => {
    const user = userEvent.setup();
    render(<BasicTabs />);
    await user.click(screen.getByRole('tab', { name: '비밀번호' }));
    expect(screen.getByRole('tab', { name: '비밀번호' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('비밀번호 패널');
  });

  describe('키보드 (automatic)', () => {
    it('Tab 은 선택된 탭 하나에만 들어가고, 다음 Tab 은 패널로 간다', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);
      await user.tab();
      expect(screen.getByRole('tab', { name: '계정' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('tabpanel')).toHaveFocus();
    });

    it('화살표로 이동하면 바로 선택되고 비활성 탭은 건너뛴다', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);
      await user.tab();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: '비밀번호' })).toHaveFocus();
      expect(screen.getByRole('tabpanel')).toHaveTextContent('비밀번호 패널');
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: '알림' })).toHaveFocus();
      // 끝에서 처음으로 순환
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: '계정' })).toHaveFocus();
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('tab', { name: '알림' })).toHaveFocus();
    });

    it('Home·End 로 처음·마지막 탭으로 이동한다', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);
      await user.tab();
      await user.keyboard('{End}');
      expect(screen.getByRole('tab', { name: '알림' })).toHaveFocus();
      await user.keyboard('{Home}');
      expect(screen.getByRole('tab', { name: '계정' })).toHaveFocus();
    });
  });

  it('manual 모드에서는 화살표로 이동만 하고 Enter 로 선택한다', async () => {
    const user = userEvent.setup();
    render(<BasicTabs activationMode="manual" />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: '비밀번호' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('계정 패널');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('비밀번호 패널');
  });

  it('vertical 이면 위·아래 화살표로 이동하고 aria-orientation 을 노출한다', async () => {
    const user = userEvent.setup();
    render(<BasicTabs orientation="vertical" />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: '비밀번호' })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('tab', { name: '계정' })).toHaveFocus();
  });

  it('value 로 제어할 수 있다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    function Controlled() {
      const [value, setValue] = React.useState('password');
      return (
        <BasicTabs
          value={value}
          onValueChange={(v) => {
            onValueChange(v);
            setValue(v);
          }}
        />
      );
    }
    render(<Controlled />);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('비밀번호 패널');
    await user.click(screen.getByRole('tab', { name: '알림' }));
    expect(onValueChange).toHaveBeenCalledWith('alerts');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('알림 패널');
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(<BasicTabs />);
    await expectNoA11yViolations(container);
  });
});
