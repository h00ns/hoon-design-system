import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import * as Field from '../field/Field';
import { Slider } from './Slider';

describe('Slider', () => {
  it('slider 역할과 값 범위를 가진다', () => {
    render(<Slider aria-label="음량" defaultValue={[30]} />);
    const thumb = screen.getByRole('slider', { name: '음량' });
    expect(thumb).toHaveAttribute('aria-valuenow', '30');
    expect(thumb).toHaveAttribute('aria-valuemin', '0');
    expect(thumb).toHaveAttribute('aria-valuemax', '100');
  });

  describe('키보드', () => {
    it('화살표·Home·End·PageUp 으로 값을 바꾼다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Slider aria-label="음량" defaultValue={[50]} step={5} onValueChange={onValueChange} />,
      );
      const thumb = screen.getByRole('slider');
      await user.tab();
      expect(thumb).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(thumb).toHaveAttribute('aria-valuenow', '55');
      await user.keyboard('{ArrowDown}');
      expect(thumb).toHaveAttribute('aria-valuenow', '50');
      await user.keyboard('{End}');
      expect(thumb).toHaveAttribute('aria-valuenow', '100');
      await user.keyboard('{Home}');
      expect(thumb).toHaveAttribute('aria-valuenow', '0');
      await user.keyboard('{PageUp}');
      expect(Number(thumb.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
      expect(onValueChange).toHaveBeenCalled();
    });

    it('disabled 면 포커스되지 않고 값이 바뀌지 않는다', async () => {
      const user = userEvent.setup();
      render(<Slider aria-label="음량" defaultValue={[50]} disabled />);
      await user.tab();
      expect(screen.getByRole('slider')).not.toHaveFocus();
    });
  });

  describe('이름과 값 문구', () => {
    it('getValueText 로 aria-valuetext 를 준다', () => {
      render(
        <Slider
          aria-label="가격"
          defaultValue={[30000]}
          min={0}
          max={100000}
          step={1000}
          getValueText={(v) => `${v.toLocaleString('ko-KR')}원`}
        />,
      );
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '30,000원');
    });

    it('범위 슬라이더의 손잡이는 한국어 기본 이름을 가진다 (Radix 영어 기본값 대신)', () => {
      render(<Slider aria-label="가격" defaultValue={[20, 80]} />);
      expect(screen.getByRole('slider', { name: '가격 최솟값' })).toHaveAttribute(
        'aria-valuenow',
        '20',
      );
      expect(screen.getByRole('slider', { name: '가격 최댓값' })).toHaveAttribute(
        'aria-valuenow',
        '80',
      );
    });

    it('thumbLabels 로 손잡이 이름을 바꿀 수 있다', () => {
      render(
        <Slider aria-label="시간" defaultValue={[9, 18]} thumbLabels={['시작', '종료']} max={24} />,
      );
      expect(screen.getByRole('slider', { name: '시간 시작' })).toBeInTheDocument();
      expect(screen.getByRole('slider', { name: '시간 종료' })).toBeInTheDocument();
    });
  });

  describe('Field 연동', () => {
    it('레이블·설명·오류를 손잡이에 연결한다', () => {
      render(
        <Field.Root invalid>
          <Field.Label>밝기</Field.Label>
          <Slider defaultValue={[40]} />
          <Field.Description>화면 밝기</Field.Description>
          <Field.ErrorMessage>너무 어둡습니다</Field.ErrorMessage>
        </Field.Root>,
      );
      const thumb = screen.getByRole('slider', { name: '밝기' });
      expect(thumb).toHaveAccessibleDescription('화면 밝기 너무 어둡습니다');
      expect(thumb).toHaveAttribute('aria-invalid', 'true');
    });

    it('범위 슬라이더는 "레이블 + 손잡이 이름" 으로 읽힌다', () => {
      render(
        <Field.Root>
          <Field.Label>가격</Field.Label>
          <Slider defaultValue={[10, 90]} />
        </Field.Root>,
      );
      expect(screen.getByRole('slider', { name: '가격 최솟값' })).toBeInTheDocument();
      expect(screen.getByRole('slider', { name: '가격 최댓값' })).toBeInTheDocument();
    });

    it('Field 의 disabled 를 이어받는다', () => {
      render(
        <Field.Root disabled>
          <Field.Label>밝기</Field.Label>
          <Slider defaultValue={[40]} />
        </Field.Root>,
      );
      expect(screen.getByRole('slider')).toHaveAttribute('data-disabled');
    });
  });

  it('제어 모드로 값을 바꾼다', async () => {
    function Controlled() {
      const [value, setValue] = React.useState([10]);
      return (
        <>
          <Slider aria-label="음량" value={value} onValueChange={setValue} />
          <output>{value[0]}</output>
        </>
      );
    }
    const user = userEvent.setup();
    render(<Controlled />);
    await user.tab();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('name 이 있으면 폼 제출에 값이 포함된다', async () => {
    const user = userEvent.setup();
    let data: FormData | null = null;
    render(
      <form
        onSubmit={(e) => {
          e.preventDefault();
          data = new FormData(e.currentTarget);
        }}
      >
        <Slider aria-label="음량" name="volume" defaultValue={[35]} />
        <button type="submit">제출</button>
      </form>,
    );
    await user.click(screen.getByRole('button'));
    expect(data!.get('volume')).toBe('35');
  });

  it('눈금은 보조기기에서 숨긴다', () => {
    const { container } = render(
      <Slider
        aria-label="크기"
        defaultValue={[50]}
        marks={[{ value: 0, label: '작게' }, { value: 50 }, { value: 100, label: '크게' }]}
      />,
    );
    const marks = container.querySelector('.hds-slider__marks');
    expect(marks).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelectorAll('.hds-slider__mark[data-active]')).toHaveLength(2);
  });

  describe('접근성 (axe)', () => {
    it('단일·범위·Field 위반 없음', async () => {
      const { container } = render(
        <div>
          <Slider aria-label="음량" defaultValue={[30]} />
          <Slider aria-label="가격" defaultValue={[20, 80]} />
          <Field.Root>
            <Field.Label>밝기</Field.Label>
            <Slider defaultValue={[40]} marks={[{ value: 0, label: '0' }]} />
          </Field.Root>
        </div>,
      );
      await expectNoA11yViolations(container);
    });
  });
});
