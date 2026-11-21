import { VisuallyHidden } from '@hoon-ds/react';

export default function BasicExample() {
  return (
    <p style={{ margin: 0 }}>
      화면에는 이 문장만 보인다.
      <VisuallyHidden>스크린리더는 이 문장도 읽는다.</VisuallyHidden>
    </p>
  );
}
