import { Skeleton } from '@hoon-ds/react';

export default function ShapesExample() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
      <Skeleton shape="circle" width={48} />
      <Skeleton shape="rect" width={120} height={72} />
      <div style={{ width: 200 }}>
        <Skeleton shape="text" lines={3} />
      </div>
    </div>
  );
}
