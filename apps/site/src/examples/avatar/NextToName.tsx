import { Avatar } from '@hoon-ds/react';

// 예시용 인라인 이미지. 실제로는 사용자 프로필 사진 URL 을 넣는다.
const PHOTO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#3a66f5"/><circle cx="40" cy="32" r="14" fill="#eef3ff"/><path d="M14 80a26 26 0 0 1 52 0Z" fill="#eef3ff"/></svg>',
  );

export default function NextToNameExample() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {/* 바로 옆에 이름이 텍스트로 있으므로 아바타는 장식(alt="") */}
      <Avatar src={PHOTO} name="홍길동" alt="" />
      <div>
        <div style={{ fontWeight: 600 }}>홍길동</div>
        <div style={{ color: 'var(--hds-color-fg-muted)', fontSize: 14 }}>프론트엔드 엔지니어</div>
      </div>
    </div>
  );
}
