import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import * as Field from '../field/Field';
import { Combobox } from './Combobox';
import type { ComboboxOption } from './Combobox';

const FRUITS: ComboboxOption[] = [
  { value: 'apple', label: '사과', keywords: ['apple'] },
  { value: 'banana', label: '바나나' },
  { value: 'blueberry', label: '블루베리', disabled: true },
  { value: 'grape', label: '포도' },
  { value: 'orange', label: '오렌지' },
];

function setup(props: Partial<React.ComponentProps<typeof Combobox>> = {}) {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  render(<Combobox aria-label="과일" options={FRUITS} onValueChange={onValueChange} {...props} />);
  const input = screen.getByRole('combobox', { name: '과일' });
  return { user, input, onValueChange };
}

const activeOption = (input: HTMLElement) => {
  const id = input.getAttribute('aria-activedescendant');
  return id ? document.getElementById(id) : null;
};

describe('Combobox', () => {
  describe('기본 구조', () => {
    it('combobox 역할과 APG 속성을 가진다', () => {
      const { input } = setup();
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).toHaveAttribute('aria-controls');
      expect(input).toHaveAttribute('autocomplete', 'off');
    });

    it('클릭하면 전체 목록이 열리고 포커스는 입력창에 남는다', async () => {
      const { user, input } = setup();
      await user.click(input);
      expect(input).toHaveAttribute('aria-expanded', 'true');
      const listbox = screen.getByRole('listbox');
      expect(input).toHaveAttribute('aria-controls', listbox.id);
      expect(screen.getAllByRole('option')).toHaveLength(5);
      expect(input).toHaveFocus();
    });

    it('defaultValue 의 레이블을 입력창에 보여준다', () => {
      const { input } = setup({ defaultValue: 'grape' });
      expect(input).toHaveValue('포도');
    });
  });

  describe('검색', () => {
    it('입력하면 목록이 열리고 걸러진다', async () => {
      const { user, input } = setup();
      await user.type(input, '바');
      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['바나나']);
    });

    it('keywords 로도 찾는다 (대소문자 무시)', async () => {
      const { user, input } = setup();
      await user.type(input, 'APP');
      expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['사과']);
    });

    it('검색 중에는 첫 결과가 강조되어 Enter 한 번으로 선택된다', async () => {
      const { user, input, onValueChange } = setup();
      await user.type(input, '오');
      expect(activeOption(input)).toHaveTextContent('오렌지');
      await user.keyboard('{Enter}');
      expect(onValueChange).toHaveBeenCalledWith('orange');
      expect(input).toHaveValue('오렌지');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('결과가 없으면 빈 상태 문구를 보여준다', async () => {
      const { user, input } = setup({ emptyText: '찾는 과일이 없어요' });
      await user.type(input, '수박');
      expect(screen.getByText('찾는 과일이 없어요')).toBeInTheDocument();
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('custom filter 를 쓸 수 있다', async () => {
      const { user, input } = setup({
        filter: (option, query) => option.label.startsWith(query),
      });
      await user.type(input, '나');
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('결과 개수를 live region 으로 알린다', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      try {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        render(<Combobox aria-label="과일" options={FRUITS} />);
        await user.type(screen.getByRole('combobox'), '오');
        act(() => {
          vi.advanceTimersByTime(600);
        });
        expect(screen.getByRole('status')).toHaveTextContent('1개 결과');
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('키보드 (APG)', () => {
    it('ArrowDown 으로 열고 첫 항목을 강조, 다시 누르면 다음으로 이동한다', async () => {
      const { user, input } = setup();
      input.focus();
      await user.keyboard('{ArrowDown}');
      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(activeOption(input)).toHaveTextContent('사과');
      await user.keyboard('{ArrowDown}');
      expect(activeOption(input)).toHaveTextContent('바나나');
    });

    it('비활성 항목은 건너뛴다', async () => {
      const { user, input } = setup();
      input.focus();
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
      expect(activeOption(input)).toHaveTextContent('포도');
    });

    it('끝에서 처음으로 순환한다', async () => {
      const { user, input } = setup();
      input.focus();
      await user.keyboard('{ArrowUp}');
      expect(activeOption(input)).toHaveTextContent('오렌지');
      await user.keyboard('{ArrowDown}');
      expect(activeOption(input)).toHaveTextContent('사과');
    });

    it('Alt+ArrowDown 은 강조 없이 목록만 연다', async () => {
      const { user, input } = setup();
      input.focus();
      await user.keyboard('{Alt>}{ArrowDown}{/Alt}');
      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(input).not.toHaveAttribute('aria-activedescendant');
    });

    it('선택된 값이 있으면 열 때 그 항목을 강조한다', async () => {
      const { user, input } = setup({ defaultValue: 'grape' });
      input.focus();
      await user.keyboard('{ArrowDown}');
      expect(activeOption(input)).toHaveTextContent('포도');
      expect(activeOption(input)).toHaveAttribute('aria-selected', 'true');
    });

    it('Home·End 는 입력창 커서로 돌아오며 강조를 해제한다', async () => {
      const { user, input } = setup();
      input.focus();
      await user.keyboard('{ArrowDown}');
      expect(input).toHaveAttribute('aria-activedescendant');
      await user.keyboard('{Home}');
      expect(input).not.toHaveAttribute('aria-activedescendant');
      expect(input).toHaveAttribute('aria-expanded', 'true');
    });

    it('Escape 는 목록을 닫고, 닫힌 상태에서 한 번 더 누르면 입력과 선택을 지운다', async () => {
      const { user, input, onValueChange } = setup({ defaultValue: 'apple' });
      await user.click(input);
      await user.keyboard('{Escape}');
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).toHaveValue('사과');
      await user.keyboard('{Escape}');
      expect(input).toHaveValue('');
      expect(onValueChange).toHaveBeenCalledWith(null);
    });

    it('Tab 은 선택 없이 목록을 닫고 다음 요소로 이동한다', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <>
          <Combobox aria-label="과일" options={FRUITS} onValueChange={onValueChange} />
          <button type="button">다음</button>
        </>,
      );
      const input = screen.getByRole('combobox');
      input.focus();
      await user.keyboard('{ArrowDown}');
      await user.tab();
      expect(screen.getByRole('button', { name: '다음' })).toHaveFocus();
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('목록이 닫혀 있을 때 Enter 는 폼을 제출한다', async () => {
      const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
      const user = userEvent.setup();
      render(
        <form onSubmit={onSubmit}>
          <Combobox aria-label="과일" options={FRUITS} />
          <button type="submit">제출</button>
        </form>,
      );
      screen.getByRole('combobox').focus();
      await user.keyboard('{Enter}');
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('한글 IME', () => {
    it('조합 중의 Enter 는 항목을 선택하지 않는다', () => {
      const onValueChange = vi.fn();
      render(<Combobox aria-label="과일" options={FRUITS} onValueChange={onValueChange} />);
      const input = screen.getByRole('combobox');
      fireEvent.compositionStart(input);
      fireEvent.change(input, { target: { value: '사' } });
      expect(activeOption(input)).toHaveTextContent('사과');
      fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
      expect(onValueChange).not.toHaveBeenCalled();
      expect(input).toHaveAttribute('aria-expanded', 'true');
      fireEvent.compositionEnd(input);
      // Safari: 조합 종료 직후 keyCode 229 Enter 도 무시한다
      fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
      expect(onValueChange).not.toHaveBeenCalled();
      // 조합이 끝난 뒤의 Enter 는 선택한다
      fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
      expect(onValueChange).toHaveBeenCalledWith('apple');
    });

    it('조합 중인 글자로도 바로 거른다', () => {
      render(<Combobox aria-label="과일" options={FRUITS} />);
      const input = screen.getByRole('combobox');
      fireEvent.compositionStart(input);
      fireEvent.change(input, { target: { value: '포' } });
      expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['포도']);
    });
  });

  describe('마우스', () => {
    it('항목을 누르면 선택되고 포커스는 입력창에 남는다', async () => {
      const { user, input, onValueChange } = setup();
      await user.click(input);
      await user.click(screen.getByRole('option', { name: '바나나' }));
      expect(onValueChange).toHaveBeenCalledWith('banana');
      expect(input).toHaveValue('바나나');
      expect(input).toHaveFocus();
    });

    it('비활성 항목은 선택되지 않는다', async () => {
      const { user, input, onValueChange } = setup();
      await user.click(input);
      const disabled = screen.getByRole('option', { name: '블루베리' });
      expect(disabled).toHaveAttribute('aria-disabled', 'true');
      await user.click(disabled);
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('지우기 버튼은 값과 입력을 지우고 입력창에 포커스한다', async () => {
      const { user, input, onValueChange } = setup({ defaultValue: 'apple' });
      const clear = screen.getByRole('button', { name: '지우기' });
      expect(clear).toHaveAttribute('tabindex', '-1');
      await user.click(clear);
      expect(input).toHaveValue('');
      expect(onValueChange).toHaveBeenCalledWith(null);
      expect(input).toHaveFocus();
      expect(screen.queryByRole('button', { name: '지우기' })).not.toBeInTheDocument();
    });
  });

  describe('상태', () => {
    it('검색어만 남기고 떠나면 선택된 레이블로 되돌린다', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Combobox aria-label="과일" options={FRUITS} defaultValue="apple" />
          <button type="button">다음</button>
        </>,
      );
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '바나');
      await user.click(screen.getByRole('button', { name: '다음' }));
      // 입력을 비우는 순간 선택이 해제되었으므로 빈 값으로 돌아간다
      expect(input).toHaveValue('');
    });

    it('제어 모드: value 가 바뀌면 입력창이 따라간다', () => {
      const { rerender } = render(<Combobox aria-label="과일" options={FRUITS} value="apple" />);
      expect(screen.getByRole('combobox')).toHaveValue('사과');
      rerender(<Combobox aria-label="과일" options={FRUITS} value="grape" />);
      expect(screen.getByRole('combobox')).toHaveValue('포도');
    });

    it('제어 모드: onValueChange 로만 바뀐다', async () => {
      function Controlled() {
        const [value, setValue] = React.useState<string | null>(null);
        return (
          <>
            <Combobox aria-label="과일" options={FRUITS} value={value} onValueChange={setValue} />
            <output>{value ?? '없음'}</output>
          </>
        );
      }
      const user = userEvent.setup();
      render(<Controlled />);
      await user.type(screen.getByRole('combobox'), '포');
      await user.keyboard('{Enter}');
      expect(screen.getByText('grape')).toBeInTheDocument();
    });

    it('disabled 면 열리지 않는다', async () => {
      const { user, input } = setup({ disabled: true });
      expect(input).toBeDisabled();
      await user.click(input);
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('name 이 있으면 선택된 값을 폼으로 제출한다', async () => {
      const user = userEvent.setup();
      let data: FormData | null = null;
      render(
        <form
          onSubmit={(e) => {
            e.preventDefault();
            data = new FormData(e.currentTarget);
          }}
        >
          <Combobox aria-label="과일" options={FRUITS} name="fruit" defaultValue="banana" />
          <button type="submit">제출</button>
        </form>,
      );
      await user.click(screen.getByRole('button', { name: '제출' }));
      expect(data!.get('fruit')).toBe('banana');
    });
  });

  describe('Field 연동', () => {
    it('레이블·설명·오류·필수를 연결하고 목록 이름도 레이블을 쓴다', async () => {
      const user = userEvent.setup();
      render(
        <Field.Root invalid required>
          <Field.Label>배송 국가</Field.Label>
          <Combobox options={FRUITS} />
          <Field.Description>배송 가능한 국가만 보입니다</Field.Description>
          <Field.ErrorMessage>국가를 선택하세요</Field.ErrorMessage>
        </Field.Root>,
      );
      const input = screen.getByRole('combobox', { name: '배송 국가' });
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAccessibleDescription('배송 가능한 국가만 보입니다 국가를 선택하세요');
      await user.click(input);
      expect(screen.getByRole('listbox', { name: '배송 국가' })).toBeInTheDocument();
    });
  });

  describe('접근성 (axe)', () => {
    it('닫힘 상태 위반 없음', async () => {
      const { container } = render(
        <main>
          <Combobox aria-label="과일" options={FRUITS} defaultValue="apple" />
        </main>,
      );
      await expectNoA11yViolations(container);
    });

    it('열림 상태 위반 없음', async () => {
      const user = userEvent.setup();
      // 포털을 랜드마크 안에 둬야 테스트 페이지에서 region 규칙을 통과한다
      function InMain() {
        const [main, setMain] = React.useState<HTMLElement | null>(null);
        return (
          <main ref={setMain}>
            <Combobox aria-label="과일" options={FRUITS} container={main} />
          </main>
        );
      }
      render(<InMain />);
      await user.click(screen.getByRole('combobox'));
      await user.keyboard('{ArrowDown}');
      await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());
      await expectNoA11yViolations(document.body);
    });

    it('결과가 없는 열림 상태 위반 없음', async () => {
      const user = userEvent.setup();
      function InMain() {
        const [main, setMain] = React.useState<HTMLElement | null>(null);
        return (
          <main ref={setMain}>
            <Combobox aria-label="과일" options={FRUITS} container={main} />
          </main>
        );
      }
      render(<InMain />);
      await user.type(screen.getByRole('combobox'), '수박');
      await waitFor(() => expect(screen.getByText('결과가 없습니다')).toBeInTheDocument());
      await expectNoA11yViolations(document.body);
    });
  });
});
