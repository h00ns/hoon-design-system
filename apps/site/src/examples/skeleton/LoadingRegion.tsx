import { Avatar, Button, Skeleton, VisuallyHidden } from '@hoon-ds/react';
import { useState } from 'react';

function ProfileCard({ loading }: { loading: boolean }) {
  return (
    <section
      aria-label="프로필"
      aria-busy={loading}
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        width: 320,
        maxWidth: '100%',
        padding: 16,
        borderRadius: 8,
        border: '1px solid var(--hds-color-border-default)',
      }}
    >
      {loading ? (
        <>
          <Skeleton shape="circle" width={40} />
          <div style={{ flex: 1 }}>
            <Skeleton shape="text" width="50%" />
            <Skeleton shape="text" width="80%" />
          </div>
        </>
      ) : (
        <>
          <Avatar name="홍길동" alt="" />
          <div>
            <strong>홍길동</strong>
            <div style={{ color: 'var(--hds-color-fg-muted)', fontSize: 14 }}>
              프론트엔드 엔지니어
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default function LoadingRegionExample() {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <ProfileCard loading={loading} />
      {/* 로딩 상태 변화를 알리는 영역은 처음부터 DOM 에 있어야 낭독된다 */}
      <VisuallyHidden role="status">
        {loading ? '프로필을 불러오는 중' : '프로필을 불러왔습니다'}
      </VisuallyHidden>
      <Button variant="secondary" size="sm" onClick={() => setLoading((v) => !v)}>
        {loading ? '로딩 끝내기' : '다시 로딩'}
      </Button>
    </div>
  );
}
