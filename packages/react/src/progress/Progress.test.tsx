import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { Progress } from './Progress';

describe('Progress', () => {
  it('progressbar 역할과 값을 노출하고 기본 값 문구는 백분율이다', () => {
    render(<Progress value={42} aria-label="업로드" />);
    const bar = screen.getByRole('progressbar', { name: '업로드' });
    expect(bar).toHaveAttribute('aria-valuenow', '42');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuetext', '42%');
  });

  it('max 를 반영해 백분율을 계산한다', () => {
    render(<Progress value={3} max={4} aria-label="단계" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '75%');
  });

  it('getValueLabel 로 값 문구를 바꾸고, 보이는 값에도 같은 문구를 쓴다', () => {
    render(
      <Progress
        value={3}
        max={5}
        label="설문"
        showValue
        getValueLabel={(value, max) => `${max}단계 중 ${value}단계`}
      />,
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '5단계 중 3단계');
    expect(screen.getByText('5단계 중 3단계')).toHaveAttribute('aria-hidden', 'true');
  });

  it('label 을 진행 막대의 이름으로 연결한다', () => {
    render(<Progress value={10} label="파일 업로드" />);
    expect(screen.getByRole('progressbar', { name: '파일 업로드' })).toBeInTheDocument();
  });

  it('aria-labelledby 를 직접 주면 그것을 쓴다', () => {
    render(
      <>
        <h2 id="title">백업</h2>
        <Progress value={10} label="무시되는 레이블" aria-labelledby="title" />
      </>,
    );
    expect(screen.getByRole('progressbar', { name: '백업' })).toBeInTheDocument();
  });

  it('value 가 null 이면 indeterminate 상태가 된다', () => {
    const { container } = render(<Progress value={null} aria-label="불러오는 중" showValue />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute('data-state', 'indeterminate');
    expect(container.querySelector('.hds-progress')).toHaveAttribute('data-indeterminate');
    expect(container.querySelector('.hds-progress__value')).toBeNull();
  });

  it('범위를 벗어난 값은 0~max 로 자른다', () => {
    const { rerender } = render(<Progress value={140} aria-label="업로드" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    rerender(<Progress value={-5} aria-label="업로드" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('완료되면 data-state="complete" 가 된다', () => {
    render(<Progress value={100} aria-label="업로드" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-state', 'complete');
  });

  it('size·tone 을 래퍼의 data 속성으로 노출하고, className 은 래퍼에, ref 는 progressbar 에 붙는다', () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <Progress ref={ref} value={1} aria-label="x" size="lg" tone="danger" className="custom" />,
    );
    const wrapper = container.querySelector('.hds-progress');
    expect(wrapper).toHaveAttribute('data-size', 'lg');
    expect(wrapper).toHaveAttribute('data-tone', 'danger');
    expect(wrapper).toHaveClass('custom');
    expect(ref.current).toBe(screen.getByRole('progressbar'));
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(
      <div>
        <Progress value={42} label="업로드" showValue />
        <Progress value={null} aria-label="불러오는 중" />
        <Progress value={100} label="완료" tone="success" />
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
