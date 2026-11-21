import { VisuallyHidden } from '@hoon-ds/react';

export default function CountContextExample() {
  return (
    <p style={{ margin: 0 }}>
      장바구니 <strong>3</strong>
      <VisuallyHidden>개 상품</VisuallyHidden>
    </p>
  );
}
