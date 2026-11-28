import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../test/axe';
import * as Icons from './index';
import { ICON_CATEGORIES, ICON_META } from './meta';

describe('Icon', () => {
  it('기본은 장식: 보조기기에서 숨기고 포커스도 받지 않는다', () => {
    const { container } = render(<Icons.SearchIcon />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg).not.toHaveAttribute('role');
  });

  it('title 을 주면 role="img" 와 <title> 로 이름을 가진다', () => {
    render(<Icons.WarningIcon title="경고" />);
    const img = screen.getByRole('img', { name: '경고' });
    expect(img).not.toHaveAttribute('aria-hidden');
    expect(img.querySelector('title')).toHaveTextContent('경고');
  });

  it('aria-label 로 이름을 줘도 숨기지 않는다', () => {
    render(<Icons.CheckIcon aria-label="완료" />);
    expect(screen.getByRole('img', { name: '완료' })).toBeInTheDocument();
  });

  it('크기 기본값은 1em 이고 size 로 바꿀 수 있다', () => {
    const { container, rerender } = render(<Icons.PlusIcon />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '1em');
    rerender(<Icons.PlusIcon size={20} />);
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('색은 currentColor 를 따르고 color 로 바꿀 수 있다', () => {
    const { container, rerender } = render(<Icons.HeartIcon />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('fill', 'currentColor');
    rerender(<Icons.HeartIcon color="red" />);
    expect(svg).toHaveAttribute('fill', 'red');
  });

  it('weight 마다 다른 모양을 그린다', () => {
    const d = (weight: Icons.IconWeight) =>
      render(<Icons.StarIcon weight={weight} />)
        .container.querySelector('path')!
        .getAttribute('d');
    const [regular, bold, fill] = [d('regular'), d('bold'), d('fill')];
    expect(new Set([regular, bold, fill]).size).toBe(3);
  });

  it('className 은 hds-icon 뒤에 붙고, ref 는 svg 를 가리킨다', () => {
    const ref = React.createRef<SVGSVGElement>();
    const { container } = render(<Icons.GearIcon ref={ref} className="spin" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveClass('hds-icon', 'spin');
    expect(svg).toHaveAttribute('data-icon', 'gear');
    expect(ref.current).toBe(svg);
  });

  it('mirrored 면 좌우 반전한다', () => {
    const { container } = render(<Icons.ArrowRightIcon mirrored />);
    expect(container.querySelector('svg')).toHaveStyle({ transform: 'scaleX(-1)' });
  });

  it('displayName 과 iconName 을 가진다', () => {
    expect(Icons.ChevronDownIcon.displayName).toBe('ChevronDownIcon');
    expect(Icons.ChevronDownIcon.iconName).toBe('chevron-down');
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(
      <div>
        <button type="button">
          <Icons.TrashIcon /> 삭제
        </button>
        <Icons.InfoIcon title="안내" />
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});

describe('메타데이터', () => {
  it('모든 메타 항목에 같은 이름의 컴포넌트가 있다', () => {
    const exported = Icons as unknown as Record<string, unknown>;
    for (const meta of ICON_META) {
      expect(exported[meta.component], meta.component).toBeDefined();
      expect(ICON_CATEGORIES[meta.category]).toBeDefined();
      expect(meta.tags.length).toBeGreaterThan(0);
    }
  });

  it('이름이 겹치지 않는다', () => {
    const names = ICON_META.map((m) => m.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
