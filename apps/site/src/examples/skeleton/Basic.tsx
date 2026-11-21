import { Skeleton } from '@hoon-ds/react';

export default function BasicExample() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%', maxWidth: 320 }}>
      <Skeleton shape="circle" width={40} />
      <div style={{ flex: 1 }}>
        <Skeleton shape="text" width="50%" />
        <Skeleton shape="text" width="80%" />
      </div>
    </div>
  );
}
