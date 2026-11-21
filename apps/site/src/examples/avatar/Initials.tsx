import { Avatar } from '@hoon-ds/react';

export default function InitialsExample() {
  return (
    <>
      <Avatar name="홍길동" />
      <Avatar name="남궁민수" />
      <Avatar name="이산" />
      <Avatar name="Jane Doe" />
      <Avatar name="hoon" />
      {/* 이름이 없으면 기본 사람 아이콘 */}
      <Avatar />
    </>
  );
}
