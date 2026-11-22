import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Combobox, Field } from '@hoon-ds/react';
import type { ComboboxOption } from '@hoon-ds/react';
import { useState } from 'react';

const CITIES: ComboboxOption[] = [
  { value: 'seoul', label: '서울', keywords: ['seoul'] },
  { value: 'busan', label: '부산', keywords: ['busan'] },
  { value: 'incheon', label: '인천', keywords: ['incheon'] },
  { value: 'daegu', label: '대구', keywords: ['daegu'] },
  { value: 'daejeon', label: '대전', keywords: ['daejeon'] },
  { value: 'gwangju', label: '광주', keywords: ['gwangju'] },
  { value: 'ulsan', label: '울산', keywords: ['ulsan'] },
  { value: 'sejong', label: '세종', keywords: ['sejong'], disabled: true },
  { value: 'jeju', label: '제주', keywords: ['jeju'] },
];

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  args: { options: CITIES, 'aria-label': '도시', placeholder: '도시 검색' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    clearable: { control: 'boolean' },
    options: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithField: Story = {
  render: (args) => (
    <Field.Root required>
      <Field.Label>배송 도시</Field.Label>
      <Combobox {...args} aria-label={undefined} />
      <Field.Description>한글이나 영문으로 검색할 수 있습니다.</Field.Description>
    </Field.Root>
  ),
};

export const Invalid: Story = {
  render: (args) => (
    <Field.Root invalid>
      <Field.Label>배송 도시</Field.Label>
      <Combobox {...args} aria-label={undefined} />
      <Field.ErrorMessage>배송 도시를 선택하세요.</Field.ErrorMessage>
    </Field.Root>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [value, setValue] = useState<string | null>('busan');
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Combobox {...args} value={value} onValueChange={setValue} />
        <p style={{ margin: 0 }}>선택: {value ?? '없음'}</p>
        <Button variant="secondary" size="sm" onClick={() => setValue('jeju')}>
          제주로 바꾸기
        </Button>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Combobox {...args} size="sm" aria-label="도시 (작게)" />
      <Combobox {...args} size="md" aria-label="도시 (보통)" />
      <Combobox {...args} size="lg" aria-label="도시 (크게)" />
    </div>
  ),
};

export const CustomRender: Story = {
  render: (args) => (
    <Combobox
      {...args}
      renderOption={(option, { selected }) => (
        <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span>{option.label}</span>
          <span style={{ color: 'var(--hds-color-fg-muted)', fontSize: 12 }}>
            {selected ? '선택됨' : option.keywords?.[0]}
          </span>
        </span>
      )}
    />
  ),
};

export const InForm: Story = {
  render: function InFormStory(args) {
    const [submitted, setSubmitted] = useState('');
    return (
      <form
        style={{ display: 'grid', gap: 12 }}
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(String(new FormData(e.currentTarget).get('city') ?? ''));
        }}
      >
        <Combobox {...args} name="city" />
        <Button type="submit">제출</Button>
        {submitted && <output>city={submitted}</output>}
      </form>
    );
  },
};
