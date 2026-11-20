import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import * as Field from '../field/Field';
import * as Select from './Select';

const FRUITS = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'blueberry', label: '블루베리', disabled: true },
  { value: 'grape', label: '포도' },
  { value: 'orange', label: '오렌지' },
];

function FruitSelect(
  props: Select.SelectRootProps & { triggerProps?: Select.SelectTriggerProps; label?: string },
) {
  const { triggerProps, label = '과일', ...rootProps } = props;
  return (
    <Select.Root {...rootProps}>
      <Select.Trigger aria-label={label} {...triggerProps}>
        <Select.Value placeholder="선택하세요" />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>과일</Select.Label>
          {FRUITS.map((f) => (
            <Select.Item key={f.value} value={f.value} disabled={f.disabled}>
              {f.label}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}

describe('Select', () => {
  describe('기본', () => {
    it('combobox 역할과 placeholder 를 가진다', () => {
      render(<FruitSelect />);
      const trigger = screen.getByRole('combobox', { name: '과일' });
      expect(trigger).toHaveTextContent('선택하세요');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('data-placeholder');
      expect(trigger).toHaveAttribute('data-size', 'md');
    });

    it('클릭하면 listbox 가 열리고 항목을 고를 수 있다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<FruitSelect onValueChange={onValueChange} />);
      const trigger = screen.getByRole('combobox');

      await user.click(trigger);
      const listbox = await screen.findByRole('listbox');
      // 열린 동안 바깥 콘텐츠는 aria-hidden 처리되므로 미리 잡아둔 참조로 확인한다
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      await user.click(within(listbox).getByRole('option', { name: '포도' }));
      expect(onValueChange).toHaveBeenCalledWith('grape');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveTextContent('포도');
    });

    it('비활성 항목은 aria-disabled 로 노출되고 선택되지 않는다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<FruitSelect onValueChange={onValueChange} />);
      await user.click(screen.getByRole('combobox'));
      const disabled = await screen.findByRole('option', { name: '블루베리' });
      expect(disabled).toHaveAttribute('aria-disabled', 'true');
      await user.click(disabled);
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('선택된 항목에 aria-selected 를 건다', async () => {
      const user = userEvent.setup();
      render(<FruitSelect defaultValue="banana" />);
      await user.click(screen.getByRole('combobox'));
      expect(await screen.findByRole('option', { name: '바나나' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });
  });

  describe('키보드', () => {
    it('Enter 로 열고, 화살표로 이동해 Enter 로 고른 뒤 포커스가 트리거로 돌아온다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<FruitSelect onValueChange={onValueChange} />);

      await user.tab();
      expect(screen.getByRole('combobox')).toHaveFocus();
      await user.keyboard('{Enter}');
      await screen.findByRole('listbox');
      // 첫 항목(사과)에서 시작 → 아래로 한 칸 = 바나나
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(onValueChange).toHaveBeenCalledWith('banana');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });

    it('Space·ArrowDown 으로도 열린다', async () => {
      const user = userEvent.setup();
      render(<FruitSelect />);
      await user.tab();
      await user.keyboard(' ');
      expect(await screen.findByRole('listbox')).toBeInTheDocument();
      await user.keyboard('{Escape}');
      await user.keyboard('{ArrowDown}');
      expect(await screen.findByRole('listbox')).toBeInTheDocument();
    });

    it('화살표 이동은 비활성 항목을 건너뛴다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<FruitSelect defaultValue="banana" onValueChange={onValueChange} />);
      await user.tab();
      await user.keyboard('{Enter}');
      await screen.findByRole('listbox');
      await user.keyboard('{ArrowDown}{Enter}');
      expect(onValueChange).toHaveBeenCalledWith('grape');
    });

    it('Home·End 로 처음·마지막 항목으로 이동한다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<FruitSelect defaultValue="banana" onValueChange={onValueChange} />);
      await user.tab();
      await user.keyboard('{Enter}');
      await screen.findByRole('listbox');
      await user.keyboard('{End}{Enter}');
      expect(onValueChange).toHaveBeenLastCalledWith('orange');

      await user.keyboard('{Enter}');
      await screen.findByRole('listbox');
      await user.keyboard('{Home}{Enter}');
      expect(onValueChange).toHaveBeenLastCalledWith('apple');
    });

    it('Esc 로 값을 바꾸지 않고 닫으며 포커스를 트리거로 되돌린다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<FruitSelect onValueChange={onValueChange} />);
      await user.tab();
      await user.keyboard('{Enter}');
      await screen.findByRole('listbox');
      await user.keyboard('{ArrowDown}{Escape}');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(onValueChange).not.toHaveBeenCalled();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });

    it('닫힌 상태에서 글자를 입력하면 일치하는 항목을 선택한다 (typeahead)', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<FruitSelect onValueChange={onValueChange} />);
      await user.tab();
      await user.keyboard('포');
      expect(onValueChange).toHaveBeenCalledWith('grape');
    });
  });

  describe('제어', () => {
    it('value 로 제어할 수 있다', async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [value, setValue] = React.useState('apple');
        return (
          <>
            <FruitSelect value={value} onValueChange={setValue} />
            <output>{value}</output>
          </>
        );
      }
      render(<Controlled />);
      expect(screen.getByRole('combobox')).toHaveTextContent('사과');
      await user.click(screen.getByRole('combobox'));
      await user.click(await screen.findByRole('option', { name: '오렌지' }));
      expect(screen.getByRole('status')).toHaveTextContent('orange');
    });
  });

  describe('폼', () => {
    it('name 이 있으면 네이티브 폼 제출에 값이 포함된다', () => {
      const { container } = render(
        <form>
          <FruitSelect name="fruit" defaultValue="grape" />
        </form>,
      );
      const form = container.querySelector('form')!;
      expect(new FormData(form).get('fruit')).toBe('grape');
    });
  });

  describe('Field 연결', () => {
    it('레이블·설명·오류·required·disabled 를 트리거에 연결한다', () => {
      render(
        <Field.Root invalid required>
          <Field.Label>배송 국가</Field.Label>
          <Select.Root>
            <Select.Trigger>
              <Select.Value placeholder="선택하세요" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="kr">대한민국</Select.Item>
            </Select.Content>
          </Select.Root>
          <Field.Description>배송 가능한 국가만 표시됩니다</Field.Description>
          <Field.ErrorMessage>국가를 선택하세요</Field.ErrorMessage>
        </Field.Root>,
      );
      const trigger = screen.getByRole('combobox', { name: '배송 국가' });
      expect(trigger).toHaveAttribute('aria-invalid', 'true');
      expect(trigger).toHaveAttribute('aria-required', 'true');
      expect(trigger).toHaveAccessibleDescription(
        '배송 가능한 국가만 표시됩니다 국가를 선택하세요',
      );
    });

    it('Field 의 disabled 를 이어받는다', () => {
      render(
        <Field.Root disabled>
          <Field.Label>국가</Field.Label>
          <Select.Root>
            <Select.Trigger>
              <Select.Value placeholder="선택하세요" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="kr">대한민국</Select.Item>
            </Select.Content>
          </Select.Root>
        </Field.Root>,
      );
      expect(screen.getByRole('combobox', { name: '국가' })).toBeDisabled();
    });
  });

  describe('접근성 (axe)', () => {
    it('닫힌 상태 위반 없음', async () => {
      const { container } = render(<FruitSelect />);
      await expectNoA11yViolations(container);
    });

    it('열린 상태 위반 없음', async () => {
      const user = userEvent.setup();
      // 포털을 랜드마크 안으로 보내 페이지 구조 규칙(region)과 분리해 검사한다
      function InMain() {
        const [main, setMain] = React.useState<HTMLElement | null>(null);
        return (
          <main ref={setMain}>
            <Select.Root>
              <Select.Trigger aria-label="과일">
                <Select.Value placeholder="선택하세요" />
              </Select.Trigger>
              <Select.Content container={main}>
                <Select.Group>
                  <Select.Label>과일</Select.Label>
                  <Select.Item value="apple">사과</Select.Item>
                  <Select.Item value="pear" disabled>
                    배
                  </Select.Item>
                </Select.Group>
                <Select.Separator />
                <Select.Item value="etc">기타</Select.Item>
              </Select.Content>
            </Select.Root>
          </main>
        );
      }
      const { container } = render(<InMain />);
      await user.click(screen.getByRole('combobox'));
      await screen.findByRole('listbox');
      await expectNoA11yViolations(container);
    });
  });
});
