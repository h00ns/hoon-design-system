import { Combobox, Field } from '@hoon-ds/react';

const MEMBERS = [
  { value: 'kim', label: '김서연', keywords: ['디자인'] },
  { value: 'lee', label: '이도윤', keywords: ['프런트엔드'] },
  { value: 'park', label: '박지호', keywords: ['백엔드'] },
  { value: 'choi', label: '최하은', keywords: ['데이터'] },
];

export default function CustomRenderExample() {
  return (
    <Field.Root style={{ width: '100%', maxWidth: 320 }}>
      <Field.Label>담당자</Field.Label>
      <Combobox
        options={MEMBERS}
        placeholder="이름이나 팀으로 검색"
        // 항목 내용은 접근 가능한 이름이 되므로 레이블 텍스트를 꼭 포함한다
        renderOption={(option) => (
          <span style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <span>{option.label}</span>
            <span style={{ color: 'var(--hds-color-fg-muted)', fontSize: 13 }}>
              {option.keywords?.[0]}
            </span>
          </span>
        )}
      />
    </Field.Root>
  );
}
