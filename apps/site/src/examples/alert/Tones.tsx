import { Alert } from '@hoon-ds/react';

export default function TonesExample() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 560 }}>
      <Alert tone="info" title="정기 점검 안내">
        11월 22일 02:00~04:00 동안 일부 기능을 사용할 수 없습니다.
      </Alert>
      <Alert tone="success" title="결제가 완료되었습니다">
        영수증을 메일로 보냈습니다.
      </Alert>
      <Alert tone="warning" title="저장 공간이 부족합니다">
        사용량이 90%를 넘었습니다. 오래된 파일을 정리해 주세요.
      </Alert>
      <Alert tone="danger" title="결제에 실패했습니다">
        카드 한도를 확인하거나 다른 결제 수단을 선택해 주세요.
      </Alert>
    </div>
  );
}
