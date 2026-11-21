import { Field, Select } from '@hoon-ds/react';

const COUNTRIES = [
  '가나',
  '그리스',
  '나이지리아',
  '네덜란드',
  '노르웨이',
  '뉴질랜드',
  '대한민국',
  '덴마크',
  '독일',
  '러시아',
  '루마니아',
  '멕시코',
  '모로코',
  '미국',
  '베트남',
  '벨기에',
  '브라질',
  '스웨덴',
  '스위스',
  '스페인',
  '싱가포르',
  '아르헨티나',
  '아일랜드',
  '영국',
  '오스트리아',
  '이집트',
  '이탈리아',
  '인도',
  '인도네시아',
  '일본',
  '중국',
  '체코',
  '칠레',
  '캐나다',
  '태국',
  '튀르키예',
  '포르투갈',
  '폴란드',
  '프랑스',
  '핀란드',
  '필리핀',
  '헝가리',
  '호주',
];

export default function LongListExample() {
  return (
    <Field.Root style={{ width: '100%', maxWidth: 280 }}>
      <Field.Label>국가</Field.Label>
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="국가를 선택하세요" />
        </Select.Trigger>
        <Select.Content>
          {COUNTRIES.map((country) => (
            <Select.Item key={country} value={country}>
              {country}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Field.Description>
        목록을 연 채로 글자를 입력하면 해당 항목으로 이동합니다.
      </Field.Description>
    </Field.Root>
  );
}
