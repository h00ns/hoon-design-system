import { HoverCard } from '@hoon-ds/react';

export default function WithArrowExample() {
  return (
    <p style={{ margin: 0 }}>
      색과 간격은{' '}
      <HoverCard.Root openDelay={300}>
        <HoverCard.Trigger href="#tokens">디자인 토큰</HoverCard.Trigger>
        <HoverCard.Content arrow side="top">
          색, 간격, 글꼴 같은 디자인 결정을 이름 붙여 저장한 값입니다.
        </HoverCard.Content>
      </HoverCard.Root>
      으로 관리합니다.
    </p>
  );
}
