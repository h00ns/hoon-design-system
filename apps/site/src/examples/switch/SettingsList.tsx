import { Switch } from '@hoon-ds/react';
import { useState } from 'react';

const row = { width: '100%', justifyContent: 'space-between' } as const;

export default function SettingsListExample() {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 360 }}>
      <Switch labelPosition="start" checked={push} onCheckedChange={setPush} style={row}>
        푸시 알림
      </Switch>
      <Switch labelPosition="start" checked={email} onCheckedChange={setEmail} style={row}>
        이메일 알림
      </Switch>
    </div>
  );
}
