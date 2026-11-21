import { Accordion } from '@hoon-ds/react';

export default function MultipleExample() {
  return (
    <Accordion.Root
      type="multiple"
      defaultValue={['basic', 'pro']}
      style={{ width: '100%', maxWidth: 520 }}
    >
      <Accordion.Item value="basic">
        <Accordion.Trigger>Basic 요금제</Accordion.Trigger>
        <Accordion.Content>월 9,900원 · 프로젝트 3개 · 저장 공간 10GB</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="pro">
        <Accordion.Trigger>Pro 요금제</Accordion.Trigger>
        <Accordion.Content>월 19,900원 · 프로젝트 무제한 · 저장 공간 100GB</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="team">
        <Accordion.Trigger>Team 요금제</Accordion.Trigger>
        <Accordion.Content>사용자당 월 14,900원 · 권한 관리 · 감사 로그</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
