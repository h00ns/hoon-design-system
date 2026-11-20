import axe from 'axe-core';
import { expect } from 'vitest';

/**
 * axe-core 로 접근성 위반을 검사한다.
 * jsdom 은 레이아웃·색을 계산하지 못하므로 color-contrast 는 끈다
 * (색 대비는 @hoon-ds/tokens 의 대비 테스트와 Storybook a11y 애드온이 담당).
 */
export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false } },
  });
  const violations = results.violations.map(
    (v) => `[${v.id}] ${v.help}\n  ${v.nodes.map((n) => n.html).join('\n  ')}`,
  );
  expect(violations, violations.join('\n\n')).toEqual([]);
}
