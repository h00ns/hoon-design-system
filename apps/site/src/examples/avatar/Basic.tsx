import { Avatar } from '@hoon-ds/react';

// 예시용 인라인 이미지. 실제로는 사용자 프로필 사진 URL 을 넣는다.
const PHOTO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#3a66f5"/><circle cx="40" cy="32" r="14" fill="#eef3ff"/><path d="M14 80a26 26 0 0 1 52 0Z" fill="#eef3ff"/></svg>',
  );

export default function BasicExample() {
  return (
    <>
      <Avatar src={PHOTO} name="홍길동" />
      <Avatar name="홍길동" />
    </>
  );
}
