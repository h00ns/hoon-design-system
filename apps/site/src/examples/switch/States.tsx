import { Switch } from '@hoon-ds/react';

export default function StatesExample() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Switch>꺼짐</Switch>
      <Switch defaultChecked>켜짐</Switch>
      <Switch disabled>비활성 · 꺼짐</Switch>
      <Switch disabled defaultChecked>
        비활성 · 켜짐
      </Switch>
    </div>
  );
}
