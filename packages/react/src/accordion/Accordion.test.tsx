import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import * as Accordion from './Accordion';

const FAQ = [
  { value: 'ship', q: '배송은 얼마나 걸리나요?', a: '영업일 기준 2~3일' },
  { value: 'refund', q: '환불할 수 있나요?', a: '수령 후 7일 이내' },
  { value: 'gift', q: '선물 포장이 되나요?', a: '주문 시 선택' },
];

function Faq(
  props: Accordion.AccordionRootProps & { headingLevel?: Accordion.AccordionHeadingLevel },
) {
  const { headingLevel, ...rootProps } = props;
  return (
    <Accordion.Root {...rootProps}>
      {FAQ.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Trigger headingLevel={headingLevel}>{item.q}</Accordion.Trigger>
          <Accordion.Content>{item.a}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

describe('Accordion', () => {
  it('트리거는 제목(h3) 안의 버튼이고 aria-expanded·aria-controls 를 가진다', () => {
    render(<Faq type="single" collapsible />);
    const trigger = screen.getByRole('button', { name: '배송은 얼마나 걸리나요?' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger.closest('h3')).not.toBeNull();
    expect(
      screen.getByRole('heading', { level: 3, name: '배송은 얼마나 걸리나요?' }),
    ).toBeInTheDocument();
  });

  it('headingLevel 로 제목 레벨을 바꾼다', () => {
    render(<Faq type="single" headingLevel={2} />);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3);
  });

  it('열면 region 이 트리거 이름으로 노출된다', async () => {
    const user = userEvent.setup();
    render(<Faq type="single" collapsible />);
    const trigger = screen.getByRole('button', { name: '환불할 수 있나요?' });
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const region = screen.getByRole('region', { name: '환불할 수 있나요?' });
    expect(region).toHaveTextContent('수령 후 7일 이내');
    expect(trigger).toHaveAttribute('aria-controls', region.id);
  });

  it('single: 다른 항목을 열면 이전 항목이 닫힌다', async () => {
    const user = userEvent.setup();
    render(<Faq type="single" defaultValue="ship" />);
    await user.click(screen.getByRole('button', { name: '환불할 수 있나요?' }));
    expect(screen.getByRole('button', { name: '배송은 얼마나 걸리나요?' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('single + collapsible 이 아니면 열린 항목을 다시 닫을 수 없다', async () => {
    const user = userEvent.setup();
    render(<Faq type="single" defaultValue="ship" />);
    const trigger = screen.getByRole('button', { name: '배송은 얼마나 걸리나요?' });
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-disabled', 'true');
  });

  it('multiple: 여러 항목을 동시에 연다', async () => {
    const user = userEvent.setup();
    render(<Faq type="multiple" />);
    await user.click(screen.getByRole('button', { name: '배송은 얼마나 걸리나요?' }));
    await user.click(screen.getByRole('button', { name: '환불할 수 있나요?' }));
    expect(screen.getAllByRole('region')).toHaveLength(2);
  });

  describe('키보드', () => {
    it('Enter·Space 로 토글한다', async () => {
      const user = userEvent.setup();
      render(<Faq type="single" collapsible />);
      await user.tab();
      const trigger = screen.getByRole('button', { name: '배송은 얼마나 걸리나요?' });
      expect(trigger).toHaveFocus();
      await user.keyboard('{Enter}');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await user.keyboard(' ');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('위·아래 화살표, Home·End 로 트리거 사이를 이동한다', async () => {
      const user = userEvent.setup();
      render(<Faq type="single" collapsible />);
      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('button', { name: '환불할 수 있나요?' })).toHaveFocus();
      await user.keyboard('{End}');
      expect(screen.getByRole('button', { name: '선물 포장이 되나요?' })).toHaveFocus();
      await user.keyboard('{Home}');
      expect(screen.getByRole('button', { name: '배송은 얼마나 걸리나요?' })).toHaveFocus();
      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('button', { name: '선물 포장이 되나요?' })).toHaveFocus();
    });
  });

  it('비활성 항목은 열리지 않는다', async () => {
    const user = userEvent.setup();
    render(
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="a" disabled>
          <Accordion.Trigger>준비 중</Accordion.Trigger>
          <Accordion.Content>내용</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const trigger = screen.getByRole('button', { name: '준비 중' });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('value 로 제어할 수 있다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    function Controlled() {
      const [value, setValue] = React.useState<string[]>(['refund']);
      return (
        <Faq
          type="multiple"
          value={value}
          onValueChange={(v: string[]) => {
            onValueChange(v);
            setValue(v);
          }}
        />
      );
    }
    render(<Controlled />);
    expect(screen.getByRole('region', { name: '환불할 수 있나요?' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '선물 포장이 되나요?' }));
    expect(onValueChange).toHaveBeenCalledWith(['refund', 'gift']);
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(<Faq type="multiple" defaultValue={['ship']} />);
    await expectNoA11yViolations(container);
  });
});
