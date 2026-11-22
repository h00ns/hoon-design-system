import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { Kbd } from './Kbd';

describe('Kbd', () => {
  it('<kbd> 로 렌더링한다', () => {
    render(<Kbd>Esc</Kbd>);
    const kbd = screen.getByText('Esc');
    expect(kbd.tagName).toBe('KBD');
    expect(kbd).toHaveClass('hds-kbd');
    expect(kbd).toHaveAttribute('data-size', 'md');
  });

  it('기호 키는 이름을 숨김 텍스트와 title 로 제공하고 기호는 숨긴다', () => {
    const { container } = render(<Kbd>⌘</Kbd>);
    const abbr = container.querySelector('abbr')!;
    expect(abbr).toHaveAttribute('title', 'Command');
    expect(abbr.querySelector('[aria-hidden="true"]')).toHaveTextContent('⌘');
    expect(container.querySelector('kbd')).toHaveTextContent('Command');
  });

  it('keys 로 조합 키를 중첩 kbd 로 렌더링한다', () => {
    const { container } = render(<Kbd keys={['⌘', 'K']} />);
    const outer = container.firstElementChild!;
    expect(outer.tagName).toBe('KBD');
    expect(outer).toHaveClass('hds-kbd-group');
    const inner = outer.querySelectorAll(':scope > kbd');
    expect(inner).toHaveLength(2);
    expect(inner[1]).toHaveTextContent('K');
  });

  it('구분자는 보조기기에서 숨긴다', () => {
    const { container } = render(<Kbd keys={['Ctrl', 'C']} separator="+" />);
    const sep = container.querySelector('.hds-kbd-group__separator')!;
    expect(sep).toHaveTextContent('+');
    expect(sep).toHaveAttribute('aria-hidden', 'true');
  });

  it('labels 로 기호 이름을 바꾸거나 더할 수 있다', () => {
    const { container } = render(<Kbd keys={['⌘', '⇧']} labels={{ '⌘': '커맨드' }} />);
    const titles = [...container.querySelectorAll('abbr')].map((a) => a.getAttribute('title'));
    expect(titles).toEqual(['커맨드', 'Shift']);
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(
      <p>
        검색은 <Kbd keys={['⌘', 'K']} />, 닫기는 <Kbd>Esc</Kbd>
      </p>,
    );
    await expectNoA11yViolations(container);
  });
});
