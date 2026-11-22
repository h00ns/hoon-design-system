import { Link } from '@hoon-ds/react';

export default function ExternalExample() {
  return (
    <p style={{ margin: 0, maxWidth: 420 }}>
      브라우저 지원 현황은{' '}
      <Link href="https://caniuse.com" external>
        Can I use
      </Link>
      에서 확인할 수 있습니다.
    </p>
  );
}
