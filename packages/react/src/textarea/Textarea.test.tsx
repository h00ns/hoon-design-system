import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import * as Field from '../field/Field';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('여러 줄을 입력할 수 있다 (Enter 는 줄바꿈)', async () => {
    render(<Textarea aria-label="메모" />);
    const textarea = screen.getByRole('textbox', { name: '메모' });
    await userEvent.type(textarea, '첫 줄{Enter}둘째 줄');
    expect(textarea).toHaveValue('첫 줄\n둘째 줄');
  });

  it('제어 컴포넌트로 동작한다', async () => {
    function Controlled() {
      const [value, setValue] = React.useState('');
      return (
        <Textarea
          aria-label="메모"
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, 5))}
        />
      );
    }
    render(<Controlled />);
    await userEvent.type(screen.getByRole('textbox'), '123456789');
    expect(screen.getByRole('textbox')).toHaveValue('12345');
  });

  it('minRows 를 rows 로, maxRows 를 CSS 변수로 전달한다', () => {
    render(<Textarea aria-label="메모" autoResize minRows={2} maxRows={6} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '2');
    expect(textarea).toHaveAttribute('data-auto-resize');
    expect(textarea.style.getPropertyValue('--_max-rows')).toBe('6');
  });

  it('resize 기본값: 일반은 vertical, autoResize 는 none', () => {
    render(
      <>
        <Textarea aria-label="a" />
        <Textarea aria-label="b" autoResize />
        <Textarea aria-label="c" resize="both" />
      </>,
    );
    expect(screen.getByRole('textbox', { name: 'a' })).toHaveAttribute('data-resize', 'vertical');
    expect(screen.getByRole('textbox', { name: 'b' })).toHaveAttribute('data-resize', 'none');
    expect(screen.getByRole('textbox', { name: 'c' })).toHaveAttribute('data-resize', 'both');
  });

  it('ref·className·style 을 textarea 에 전달한다', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="메모" className="custom" style={{ width: 200 }} />);
    expect(ref.current).toBe(screen.getByRole('textbox'));
    expect(ref.current).toHaveClass('hds-textarea', 'custom');
    expect(ref.current!.style.width).toBe('200px');
  });

  it('Field 와 연결된다', () => {
    render(
      <Field.Root invalid required>
        <Field.Label>문의 내용</Field.Label>
        <Textarea />
        <Field.Description>최대 500자</Field.Description>
        <Field.ErrorMessage>내용을 입력하세요</Field.ErrorMessage>
      </Field.Root>,
    );
    const textarea = screen.getByRole('textbox', { name: '문의 내용' });
    expect(textarea).toHaveAccessibleDescription('최대 500자 내용을 입력하세요');
    expect(textarea).toBeRequired();
    expect(textarea).toHaveAttribute('data-invalid');
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(
      <div>
        <Textarea aria-label="기본" />
        <Textarea aria-label="자동" autoResize maxRows={5} />
        <Textarea aria-label="비활성" disabled />
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
