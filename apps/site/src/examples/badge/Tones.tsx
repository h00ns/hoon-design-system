import { Badge } from '@hoon-ds/react';
import type { BadgeTone } from '@hoon-ds/react';

const LABELS: Record<BadgeTone, string> = {
  neutral: '임시저장',
  accent: '신규',
  success: '완료',
  warning: '검토 중',
  critical: '반려',
};

const TONES = Object.keys(LABELS) as BadgeTone[];

export default function TonesExample() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['subtle', 'solid'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {TONES.map((tone) => (
            <Badge key={tone} tone={tone} variant={variant}>
              {LABELS[tone]}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  );
}
