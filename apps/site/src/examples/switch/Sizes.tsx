import { Switch } from '@hoon-ds/react';

export default function SizesExample() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Switch size="sm">작게 (sm)</Switch>
      <Switch size="md">보통 (md)</Switch>
    </div>
  );
}
