import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import * as Field from '../field/Field';
import { Toggle } from './Toggle';
import * as ToggleGroup from './ToggleGroup';

const Icon = () => <svg viewBox="0 0 16 16" />;

describe('Toggle', () => {
  it('aria-pressed 로 켜짐 상태를 전달하고 클릭·Space 로 토글한다', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>굵게</Toggle>);
    const button = screen.getByRole('button', { name: '굵게' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard(' ');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(onPressedChange).toHaveBeenCalledTimes(2);
  });

  it('아이콘만 있으면 aria-label 이 이름이 되고 아이콘은 숨긴다', () => {
    const { container } = render(<Toggle icon={<Icon />} aria-label="즐겨찾기" />);
    expect(screen.getByRole('button', { name: '즐겨찾기' })).toHaveAttribute('data-icon-only');
    expect(container.querySelector('.hds-toggle__icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('아이콘 전용인데 aria-label 이 없으면 타입 오류다', () => {
    // @ts-expect-error 아이콘만 있는 토글은 aria-label 필수
    const el = <Toggle icon={<Icon />} />;
    expect(el).toBeTruthy();
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(
      <div>
        <Toggle defaultPressed>굵게</Toggle>
        <Toggle icon={<Icon />} aria-label="즐겨찾기" />
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});

describe('ToggleGroup', () => {
  function Alignment(props: { size?: 'sm' | 'md' | 'lg'; onValueChange?: (v: string) => void }) {
    return (
      <ToggleGroup.Root type="single" aria-label="정렬" defaultValue="left" {...props}>
        <ToggleGroup.Item value="left">왼쪽</ToggleGroup.Item>
        <ToggleGroup.Item value="center">가운데</ToggleGroup.Item>
        <ToggleGroup.Item value="right" disabled>
          오른쪽
        </ToggleGroup.Item>
        <ToggleGroup.Item value="justify">양쪽</ToggleGroup.Item>
      </ToggleGroup.Root>
    );
  }

  describe('single', () => {
    it('radiogroup 과 radio 로 렌더링되고 하나만 선택된다', async () => {
      const user = userEvent.setup();
      render(<Alignment />);
      expect(screen.getByRole('radiogroup', { name: '정렬' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: '왼쪽' })).toHaveAttribute('aria-checked', 'true');
      await user.click(screen.getByRole('radio', { name: '가운데' }));
      expect(screen.getByRole('radio', { name: '가운데' })).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('radio', { name: '왼쪽' })).toHaveAttribute('aria-checked', 'false');
    });

    it('Tab 은 그룹에 한 번만 들어오고 화살표로 이동하며 비활성 항목은 건너뛴다', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Alignment />
          <button type="button">다음</button>
        </>,
      );
      await user.tab();
      expect(screen.getByRole('radio', { name: '왼쪽' })).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('radio', { name: '가운데' })).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('radio', { name: '양쪽' })).toHaveFocus();
      await user.keyboard('{Home}');
      expect(screen.getByRole('radio', { name: '왼쪽' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: '다음' })).toHaveFocus();
    });

    it('Space·Enter 로 선택한다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Alignment onValueChange={onValueChange} />);
      await user.tab();
      await user.keyboard('{ArrowRight} ');
      expect(onValueChange).toHaveBeenLastCalledWith('center');
    });
  });

  describe('multiple', () => {
    it('toolbar 와 aria-pressed 버튼으로 렌더링되고 여러 개를 켤 수 있다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ToggleGroup.Root type="multiple" aria-label="글자 서식" onValueChange={onValueChange}>
          <ToggleGroup.Item value="bold" icon={<Icon />} aria-label="굵게" />
          <ToggleGroup.Item value="italic" icon={<Icon />} aria-label="기울임" />
        </ToggleGroup.Root>,
      );
      expect(screen.getByRole('toolbar', { name: '글자 서식' })).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: '굵게' }));
      await user.click(screen.getByRole('button', { name: '기울임' }));
      expect(screen.getByRole('button', { name: '굵게' })).toHaveAttribute('aria-pressed', 'true');
      expect(onValueChange).toHaveBeenLastCalledWith(['bold', 'italic']);
    });

    it('아이콘 전용 항목에 aria-label 이 없으면 타입 오류다', () => {
      // @ts-expect-error 아이콘만 있는 항목은 aria-label 필수
      const el = <ToggleGroup.Item value="x" icon={<Icon />} />;
      expect(el).toBeTruthy();
    });
  });

  it('Field 레이블·설명·비활성을 연결한다', () => {
    render(
      <Field.Root disabled>
        <Field.Label>보기 방식</Field.Label>
        <ToggleGroup.Root type="single">
          <ToggleGroup.Item value="grid">격자</ToggleGroup.Item>
          <ToggleGroup.Item value="list">목록</ToggleGroup.Item>
        </ToggleGroup.Root>
        <Field.Description>목록이 기본입니다</Field.Description>
      </Field.Root>,
    );
    const group = screen.getByRole('radiogroup', { name: '보기 방식' });
    expect(group).toHaveAccessibleDescription('목록이 기본입니다');
    expect(screen.getByRole('radio', { name: '격자' })).toBeDisabled();
  });

  it('size 를 data 속성으로 노출한다', () => {
    render(<Alignment size="sm" />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('data-size', 'sm');
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(
      <div>
        <Alignment />
        <ToggleGroup.Root type="multiple" aria-label="글자 서식" defaultValue={['bold']}>
          <ToggleGroup.Item value="bold" icon={<Icon />} aria-label="굵게" />
          <ToggleGroup.Item value="italic" icon={<Icon />}>
            기울임
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
