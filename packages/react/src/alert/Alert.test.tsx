import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { Alert } from './Alert';
import type { AlertTone } from './Alert';

const TONES: AlertTone[] = ['info', 'success', 'warning', 'danger'];

describe('Alert', () => {
  it('기본은 정적 안내라 live region 역할이 없다', () => {
    render(<Alert title="점검 안내">오늘 밤 점검이 있습니다.</Alert>);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('live="assertive" 는 role="alert", live="polite" 는 role="status"', () => {
    const { rerender } = render(<Alert live="assertive">저장 실패</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('저장 실패');
    rerender(<Alert live="polite">저장됨</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent('저장됨');
  });

  it('톤 이름을 숨김 텍스트로 앞에 붙인다 (색에만 의존하지 않음)', () => {
    render(
      <Alert tone="danger" live="assertive" title="결제 실패">
        카드 정보를 확인하세요.
      </Alert>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('오류: 결제 실패카드 정보를 확인하세요.');
  });

  it('title 이 없으면 설명 앞에 톤 이름을 붙인다', () => {
    render(<Alert tone="warning">용량이 부족합니다.</Alert>);
    expect(
      screen.getByText(/용량이 부족합니다/).closest('.hds-alert__description'),
    ).toHaveTextContent('주의: 용량이 부족합니다.');
  });

  it('toneLabel 로 바꾸거나 끌 수 있다', () => {
    const { rerender, container } = render(
      <Alert tone="success" toneLabel="완료" title="업로드" />,
    );
    expect(container).toHaveTextContent('완료: 업로드');
    rerender(<Alert tone="success" toneLabel={false} title="업로드" />);
    expect(container.querySelector('.hds-alert__title')).toHaveTextContent(/^업로드$/);
  });

  it('아이콘은 보조기기에서 숨기고 icon={false} 면 그리지 않는다', () => {
    const { container, rerender } = render(<Alert title="안내" />);
    expect(container.querySelector('.hds-alert__icon')).toHaveAttribute('aria-hidden', 'true');
    rerender(<Alert title="안내" icon={false} />);
    expect(container.querySelector('.hds-alert__icon')).toBeNull();
  });

  it('onClose 가 있으면 "닫기" 버튼을 보여주고 호출한다', async () => {
    const onClose = vi.fn();
    render(
      <Alert title="안내" onClose={onClose}>
        내용
      </Alert>,
    );
    await userEvent.click(screen.getByRole('button', { name: '닫기' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closeLabel 로 닫기 버튼 이름을 바꾼다', () => {
    render(<Alert title="안내" onClose={() => {}} closeLabel="안내 닫기" />);
    expect(screen.getByRole('button', { name: '안내 닫기' })).toBeInTheDocument();
  });

  it('actions 를 렌더링한다', () => {
    render(<Alert title="새 버전" actions={<button type="button">업데이트</button>} />);
    expect(screen.getByRole('button', { name: '업데이트' })).toBeInTheDocument();
  });

  it.each(TONES)('tone=%s 접근성 위반 없음', async (tone) => {
    const { container } = render(
      <Alert
        tone={tone}
        title="제목"
        onClose={() => {}}
        actions={<button type="button">동작</button>}
      >
        설명
      </Alert>,
    );
    await expectNoA11yViolations(container);
  });
});
