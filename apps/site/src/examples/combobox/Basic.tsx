import { Combobox, Field } from '@hoon-ds/react';

const CITIES = [
  { value: 'seoul', label: '서울', keywords: ['seoul'] },
  { value: 'busan', label: '부산', keywords: ['busan'] },
  { value: 'incheon', label: '인천', keywords: ['incheon'] },
  { value: 'daegu', label: '대구', keywords: ['daegu'] },
  { value: 'daejeon', label: '대전', keywords: ['daejeon'] },
  { value: 'gwangju', label: '광주', keywords: ['gwangju'] },
  { value: 'ulsan', label: '울산', keywords: ['ulsan'] },
  { value: 'jeju', label: '제주', keywords: ['jeju'] },
];

export default function BasicExample() {
  return (
    <Field.Root style={{ width: '100%', maxWidth: 320 }}>
      <Field.Label>도시</Field.Label>
      <Combobox options={CITIES} placeholder="도시 이름 검색" />
      <Field.Description>한글이나 영문으로 검색할 수 있습니다.</Field.Description>
    </Field.Root>
  );
}
