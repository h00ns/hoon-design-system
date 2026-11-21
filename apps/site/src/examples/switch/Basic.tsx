import { Switch } from '@hoon-ds/react';
import { useState } from 'react';

export default function BasicExample() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Switch checked={enabled} onCheckedChange={setEnabled}>
      알림 받기
    </Switch>
  );
}
