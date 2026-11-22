import { Progress } from '@hoon-ds/react';

export default function CustomValueLabelExample() {
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Progress
        value={3}
        max={5}
        label="설문 진행"
        showValue
        getValueLabel={(value, max) => `${max}단계 중 ${value}단계`}
      />
    </div>
  );
}
