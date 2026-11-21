import { Alert } from '@hoon-ds/react';

export default function TitleOrDescriptionExample() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 560 }}>
      <Alert tone="success" title="변경 사항을 저장했습니다" />
      <Alert tone="warning">이 문서는 다른 사람이 편집 중입니다.</Alert>
    </div>
  );
}
