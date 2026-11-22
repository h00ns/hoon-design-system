import { Avatar, HoverCard } from '@hoon-ds/react';

export default function BasicExample() {
  return (
    <p style={{ margin: 0 }}>
      작성자{' '}
      <HoverCard.Root>
        {/* 트리거는 실제로 이동하는 링크다. 카드의 정보는 프로필 페이지에도 있다 */}
        <HoverCard.Trigger href="#profile-hong">@홍길동</HoverCard.Trigger>
        <HoverCard.Content>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Avatar name="홍길동" alt="" />
            <div>
              <strong>홍길동</strong>
              <p style={{ margin: 0 }}>프런트엔드 개발자. 팔로워 1,284명</p>
            </div>
          </div>
        </HoverCard.Content>
      </HoverCard.Root>
    </p>
  );
}
