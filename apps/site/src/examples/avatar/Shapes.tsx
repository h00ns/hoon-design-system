import { Avatar } from '@hoon-ds/react';

export default function ShapesExample() {
  return (
    <>
      <Avatar name="홍길동" />
      <Avatar name="디자인팀" shape="square" fallback="DS" />
    </>
  );
}
