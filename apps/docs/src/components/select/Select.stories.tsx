import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Field, Select } from '@hoon-ds/react';
import { useState } from 'react';

const FRUITS = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'blueberry', label: '블루베리' },
  { value: 'grape', label: '포도' },
  { value: 'orange', label: '오렌지' },
];

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

const meta = {
  title: 'Components/Select',
  component: Select.Trigger,
  args: { size: 'md', disabled: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select.Trigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Field.Root>
      <Field.Label>좋아하는 과일</Field.Label>
      <Select.Root>
        <Select.Trigger {...args}>
          <Select.Value placeholder="과일을 선택하세요" />
        </Select.Trigger>
        <Select.Content>
          {FRUITS.map((f) => (
            <Select.Item key={f.value} value={f.value}>
              {f.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Field.Root>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Field.Root key={size}>
          <Field.Label>{size}</Field.Label>
          <Select.Root defaultValue="grape">
            <Select.Trigger size={size}>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {FRUITS.map((f) => (
                <Select.Item key={f.value} value={f.value}>
                  {f.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Field.Root>
      ))}
    </div>
  ),
};

export const WithField: Story = {
  name: 'Field 와 함께 (설명·오류)',
  render: function WithFieldStory() {
    const [value, setValue] = useState('');
    const invalid = value === '';
    return (
      <Field.Root invalid={invalid} required>
        <Field.Label>배송 국가</Field.Label>
        <Select.Root value={value} onValueChange={setValue}>
          <Select.Trigger>
            <Select.Value placeholder="국가를 선택하세요" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="kr">대한민국</Select.Item>
            <Select.Item value="jp">일본</Select.Item>
            <Select.Item value="us">미국</Select.Item>
          </Select.Content>
        </Select.Root>
        <Field.Description>배송 가능한 국가만 표시됩니다.</Field.Description>
        <Field.ErrorMessage>배송 국가를 선택하세요.</Field.ErrorMessage>
      </Field.Root>
    );
  },
};

export const Groups: Story = {
  name: '그룹 · 구분선',
  render: () => (
    <Field.Root>
      <Field.Label>음식</Field.Label>
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="음식을 선택하세요" />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Label>과일</Select.Label>
            <Select.Item value="apple">사과</Select.Item>
            <Select.Item value="banana">바나나</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.Label>채소</Select.Label>
            <Select.Item value="carrot">당근</Select.Item>
            <Select.Item value="cabbage">양배추</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </Field.Root>
  ),
};

export const DisabledItems: Story = {
  name: '비활성',
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Field.Root>
        <Field.Label>비활성 항목</Field.Label>
        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="요금제를 선택하세요" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="free">무료</Select.Item>
            <Select.Item value="pro">프로</Select.Item>
            <Select.Item value="enterprise" disabled>
              엔터프라이즈 (문의)
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </Field.Root>
      <Field.Root disabled>
        <Field.Label>비활성 Select</Field.Label>
        <Select.Root defaultValue="pro">
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="pro">프로</Select.Item>
          </Select.Content>
        </Select.Root>
      </Field.Root>
    </div>
  ),
};

export const LongList: Story = {
  name: '긴 목록',
  render: () => (
    <Field.Root>
      <Field.Label>국가</Field.Label>
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="국가를 선택하세요" />
        </Select.Trigger>
        <Select.Content>
          {COUNTRIES.map((c) => (
            <Select.Item key={c} value={c}>
              {c}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Field.Description>
        목록을 연 채로 글자를 입력하면 해당 항목으로 이동합니다.
      </Field.Description>
    </Field.Root>
  ),
};

export const ItemAligned: Story = {
  name: 'item-aligned 위치',
  render: () => (
    <Field.Root>
      <Field.Label>과일</Field.Label>
      <Select.Root defaultValue="grape">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content position="item-aligned">
          {FRUITS.map((f) => (
            <Select.Item key={f.value} value={f.value}>
              {f.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Field.Root>
  ),
};

export const InForm: Story = {
  name: '폼 제출',
  render: function InFormStory() {
    const [submitted, setSubmitted] = useState<string | null>(null);
    return (
      <form
        style={{ display: 'grid', gap: 16 }}
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          setSubmitted(String(data.get('fruit') ?? ''));
        }}
      >
        <Field.Root required>
          <Field.Label>과일</Field.Label>
          <Select.Root name="fruit">
            <Select.Trigger>
              <Select.Value placeholder="과일을 선택하세요" />
            </Select.Trigger>
            <Select.Content>
              {FRUITS.map((f) => (
                <Select.Item key={f.value} value={f.value}>
                  {f.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Field.Root>
        <Button type="submit">제출</Button>
        <output>{submitted !== null && `제출된 값: ${submitted || '(없음)'}`}</output>
      </form>
    );
  },
};
