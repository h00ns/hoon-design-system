import { Button } from '@hoon-ds/react';
import { useState } from 'react';

export default function LoadingExample() {
  const [loading, setLoading] = useState(false);

  const save = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Button loading={loading} onClick={save}>
      눌러서 저장
    </Button>
  );
}
