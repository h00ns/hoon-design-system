import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { Toaster } from './Toaster';
import { resetToasts, toast } from './toast-store';

afterEach(() => {
  act(() => resetToasts());
  vi.useRealTimers();
});

const getRegion = () => screen.getByRole('region', { name: '알림 (F8)' });

describe('Toast', () => {
  it('알림 영역에 단축키가 포함된 한국어 이름을 붙인다', () => {
    render(<Toaster />);
    expect(getRegion()).toBeInTheDocument();
  });

  it('toast() 로 띄운 토스트를 보여준다', async () => {
    render(<Toaster />);
    act(() => {
      toast('저장했습니다');
    });
    expect(await within(getRegion()).findByText('저장했습니다')).toBeInTheDocument();
  });

  it('Toaster 가 마운트되기 전에 호출한 토스트도 보여준다', async () => {
    toast('미리 호출');
    render(<Toaster />);
    expect(await screen.findByText('미리 호출')).toBeInTheDocument();
  });

  it('옵션 객체로 title·description·tone 을 받는다', async () => {
    render(<Toaster />);
    act(() => {
      toast({ title: '업로드 완료', description: '파일 3개', tone: 'success' });
    });
    const title = await screen.findByText('업로드 완료');
    const item = title.closest('.hds-toast');
    expect(item).toHaveAttribute('data-tone', 'success');
    expect(item).toHaveTextContent('성공: 업로드 완료');
    expect(within(item as HTMLElement).getByText('파일 3개')).toBeInTheDocument();
  });

  it('톤 단축 함수: toast.error 는 danger 톤', async () => {
    render(<Toaster />);
    act(() => {
      toast.error('결제에 실패했습니다');
    });
    const item = (await screen.findByText('결제에 실패했습니다')).closest('.hds-toast');
    expect(item).toHaveAttribute('data-tone', 'danger');
    expect(item).toHaveTextContent('오류: 결제에 실패했습니다');
  });

  it('오류는 assertive, 그 외는 polite 로 낭독한다', async () => {
    render(<Toaster />);
    act(() => {
      toast.error('실패');
      toast.success('성공했어요');
    });
    await waitFor(() => {
      const statuses = screen.getAllByRole('status');
      const assertive = statuses.find((s) => s.getAttribute('aria-live') === 'assertive');
      const polite = statuses.find((s) => s.getAttribute('aria-live') === 'polite');
      expect(assertive).toHaveTextContent('알림 오류: 실패');
      expect(polite).toHaveTextContent('알림 성공: 성공했어요');
    });
  });

  it('"닫기" 버튼으로 닫고 onDismiss 를 호출한다', async () => {
    const onDismiss = vi.fn();
    render(<Toaster />);
    act(() => {
      toast('닫을 토스트', { onDismiss });
    });
    const item = (await screen.findByText('닫을 토스트')).closest('.hds-toast') as HTMLElement;
    await userEvent.click(within(item).getByRole('button', { name: '닫기' }));
    await waitFor(() => expect(screen.queryByText('닫을 토스트')).not.toBeInTheDocument());
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('Esc 로 포커스된 토스트를 닫는다', async () => {
    render(<Toaster />);
    act(() => {
      toast('Esc 테스트');
    });
    const item = (await screen.findByText('Esc 테스트')).closest('.hds-toast') as HTMLElement;
    item.focus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('Esc 테스트')).not.toBeInTheDocument());
  });

  it('duration 이 지나면 자동으로 닫힌다', async () => {
    vi.useFakeTimers();
    render(<Toaster duration={3000} />);
    act(() => {
      toast('잠깐 보이는 토스트');
    });
    expect(screen.getByText('잠깐 보이는 토스트')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(2900);
    });
    expect(screen.getByText('잠깐 보이는 토스트')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.queryByText('잠깐 보이는 토스트')).not.toBeInTheDocument();
  });

  it('action 이 있으면 기본적으로 자동으로 닫히지 않는다', () => {
    vi.useFakeTimers();
    render(<Toaster duration={3000} />);
    act(() => {
      toast({
        title: '메일을 삭제했습니다',
        action: { label: '되돌리기', altText: '휴지통에서 되돌릴 수 있습니다', onClick: () => {} },
      });
    });
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.getByText('메일을 삭제했습니다')).toBeInTheDocument();
  });

  it('action 버튼을 누르면 onClick 을 호출하고 토스트를 닫는다', async () => {
    const onClick = vi.fn();
    render(<Toaster />);
    act(() => {
      toast({
        title: '메일을 삭제했습니다',
        action: { label: '되돌리기', altText: '휴지통에서 되돌릴 수 있습니다', onClick },
      });
    });
    await userEvent.click(await screen.findByRole('button', { name: '되돌리기' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByText('메일을 삭제했습니다')).not.toBeInTheDocument());
  });

  it('낭독 문구에는 action 버튼 대신 altText 를 쓴다', async () => {
    render(<Toaster />);
    act(() => {
      toast({
        title: '삭제했습니다',
        action: { label: '되돌리기', altText: '휴지통에서 되돌릴 수 있습니다', onClick: () => {} },
      });
    });
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('휴지통에서 되돌릴 수 있습니다'),
    );
    expect(screen.getByRole('status')).not.toHaveTextContent('되돌리기');
  });

  it('limit 을 넘는 토스트는 대기했다가 앞의 토스트가 닫히면 나타난다', async () => {
    render(<Toaster limit={2} />);
    let firstId = '';
    act(() => {
      firstId = toast('첫째');
      toast('둘째');
      toast('셋째');
    });
    expect(await screen.findByText('둘째')).toBeInTheDocument();
    expect(screen.queryByText('셋째')).not.toBeInTheDocument();
    act(() => toast.dismiss(firstId));
    expect(await screen.findByText('셋째')).toBeInTheDocument();
  });

  it('오류 토스트는 limit 이 차 있어도 대기하지 않고 바로 나타난다', async () => {
    render(<Toaster limit={2} />);
    act(() => {
      toast('첫째');
      toast('둘째');
      toast('셋째');
      toast.error('결제에 실패했습니다');
    });
    expect(await screen.findByText('결제에 실패했습니다')).toBeInTheDocument();
    // 오류가 자리를 차지하므로 일반 알림은 1개만 보인다
    expect(screen.getByText('첫째')).toBeInTheDocument();
    expect(screen.queryByText('둘째')).not.toBeInTheDocument();
  });

  it('같은 id 로 호출하면 새로 띄우지 않고 내용을 바꾼다', async () => {
    render(<Toaster />);
    act(() => {
      toast('업로드 중…', { id: 'upload' });
    });
    await screen.findByText('업로드 중…');
    act(() => {
      toast.success('업로드 완료', { id: 'upload' });
    });
    expect(await screen.findByText('업로드 완료')).toBeInTheDocument();
    expect(screen.queryByText('업로드 중…')).not.toBeInTheDocument();
    expect(document.querySelectorAll('.hds-toast')).toHaveLength(1);
  });

  it('toast.dismiss() 는 모든 토스트를 닫는다', async () => {
    render(<Toaster />);
    act(() => {
      toast('하나');
      toast('둘');
    });
    await screen.findByText('둘');
    act(() => toast.dismiss());
    await waitFor(() => expect(document.querySelectorAll('.hds-toast')).toHaveLength(0));
  });

  it('F8 을 누르면 알림 영역으로 포커스가 이동한다', async () => {
    render(<Toaster />);
    act(() => {
      toast('단축키');
    });
    await screen.findByText('단축키');
    fireEvent.keyDown(document, { key: 'F8', code: 'F8' });
    expect(document.querySelector('.hds-toast-viewport')).toHaveFocus();
  });

  it('closeLabel·label 을 바꿀 수 있다', async () => {
    render(<Toaster label="Notifications ({hotkey})" closeLabel="Dismiss" />);
    act(() => {
      toast('i18n');
    });
    expect(screen.getByRole('region', { name: 'Notifications (F8)' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(<Toaster />);
    act(() => {
      toast.success('저장했습니다', { description: '모든 변경 사항이 반영되었습니다.' });
      toast({
        title: '삭제했습니다',
        tone: 'warning',
        action: { label: '되돌리기', altText: '휴지통에서 되돌릴 수 있습니다', onClick: () => {} },
      });
    });
    await screen.findByText('삭제했습니다');
    await expectNoA11yViolations(container);
  });
});
