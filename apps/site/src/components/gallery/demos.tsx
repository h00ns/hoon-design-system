/**
 * 컴포넌트 갤러리의 미니 데모. 실제 컴포넌트를 정적으로 렌더링한다 (JS 없이 HTML 로 나간다).
 * 열고 닫는 오버레이는 트리거와 열린 모습의 핵심만 보여준다.
 */
import * as DS from '@hoon-ds/react';
import { CheckCircle, DotsThree, GearSix, Info, X } from '@phosphor-icons/react/ssr';
import type { ReactNode } from 'react';

const {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Field,
  IconButton,
  Input,
  RadioGroup,
  Select,
  Separator,
  Skeleton,
  Spinner,
  Switch,
  Tabs,
  Textarea,
  VisuallyHidden,
} = DS;

export const DEMOS: Record<string, () => ReactNode> = {
  button: () => (
    <div className="g-row">
      <Button size="sm" variant="secondary">
        취소
      </Button>
      <Button size="sm">저장</Button>
    </div>
  ),
  'icon-button': () => (
    <div className="g-row">
      <IconButton aria-label="설정" variant="secondary">
        <GearSix weight="bold" />
      </IconButton>
      <IconButton aria-label="설정">
        <GearSix weight="bold" />
      </IconButton>
    </div>
  ),
  field: () => (
    <Field.Root invalid className="g-field">
      <Field.Label>이메일</Field.Label>
      <Input size="sm" defaultValue="hoon@" aria-label="이메일 예시" />
      <Field.ErrorMessage>형식을 확인해 주세요</Field.ErrorMessage>
    </Field.Root>
  ),
  input: () => (
    <Input size="sm" placeholder="이름을 입력하세요" aria-label="이름 예시" className="g-field" />
  ),
  textarea: () => (
    <Textarea
      rows={2}
      defaultValue="여러 줄을 입력할 수 있어요."
      aria-label="메모 예시"
      className="g-field"
    />
  ),
  checkbox: () => (
    <div className="g-col">
      <Checkbox defaultChecked>전체 동의</Checkbox>
      <Checkbox checked="indeterminate">마케팅 수신</Checkbox>
    </div>
  ),
  'radio-group': () => (
    <RadioGroup.Root defaultValue="a" aria-label="배송 예시">
      <RadioGroup.Item value="a">빠른 배송</RadioGroup.Item>
      <RadioGroup.Item value="b">일반 배송</RadioGroup.Item>
    </RadioGroup.Root>
  ),
  switch: () => (
    <div className="g-col">
      <Switch defaultChecked>알림 받기</Switch>
      <Switch>다크 모드</Switch>
    </div>
  ),
  select: () => (
    <Select.Root>
      <Select.Trigger size="sm" aria-label="국가 예시" className="g-field">
        <Select.Value placeholder="배송 국가 선택" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="kr">대한민국</Select.Item>
      </Select.Content>
    </Select.Root>
  ),
  tabs: () => (
    <Tabs.Root defaultValue="a" className="g-field">
      <Tabs.List aria-label="탭 예시">
        <Tabs.Trigger value="a">개요</Tabs.Trigger>
        <Tabs.Trigger value="b">리뷰</Tabs.Trigger>
        <Tabs.Trigger value="c">문의</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="a" className="g-muted">
        상품 설명
      </Tabs.Content>
    </Tabs.Root>
  ),
  accordion: () => (
    <Accordion.Root type="single" defaultValue="a" collapsible className="g-field">
      <Accordion.Item value="a">
        <Accordion.Trigger>배송은 얼마나 걸리나요?</Accordion.Trigger>
        <Accordion.Content>평일 기준 1~2일</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
  alert: () => <Alert tone="success" title="저장했습니다" className="g-field" />,
  badge: () => (
    <div className="g-row">
      <Badge tone="accent">신규</Badge>
      <Badge tone="success">완료</Badge>
      <Badge tone="warning">대기</Badge>
      <Badge tone="danger" variant="solid">
        오류
      </Badge>
    </div>
  ),
  avatar: () => (
    <div className="g-row">
      <Avatar name="김하늘" />
      <Avatar name="이도윤" />
      <Avatar name="박서연" />
    </div>
  ),
  spinner: () => <Spinner label="불러오는 중" />,
  skeleton: () => (
    <div className="g-skeleton">
      <Skeleton shape="circle" />
      <div className="g-col g-grow">
        <Skeleton />
        <Skeleton style={{ width: '60%' }} />
      </div>
    </div>
  ),
  separator: () => (
    <div className="g-row g-muted">
      <span>설정</span>
      <Separator orientation="vertical" decorative style={{ height: 16 }} />
      <span>도움말</span>
    </div>
  ),
  'visually-hidden': () => (
    <p className="g-muted" style={{ margin: 0 }}>
      장바구니 <strong>3</strong>
      <VisuallyHidden>개 상품</VisuallyHidden>
    </p>
  ),

  /* 오버레이는 "열린 모습"을 정적으로 보여준다 (실제 버튼 + 표면) */
  dialog: () => (
    <div className="g-surface g-dialog">
      <p className="g-surface__title">프로필 편집</p>
      <p className="g-surface__text">변경 내용을 저장할까요?</p>
      <div className="g-row g-end">
        <Button size="sm" variant="ghost">
          취소
        </Button>
        <Button size="sm">저장</Button>
      </div>
    </div>
  ),
  'alert-dialog': () => (
    <div className="g-surface g-dialog">
      <p className="g-surface__title">프로젝트를 삭제할까요?</p>
      <p className="g-surface__text">되돌릴 수 없습니다.</p>
      <div className="g-row g-end">
        <Button size="sm" variant="secondary">
          취소
        </Button>
        <Button size="sm" variant="danger">
          삭제
        </Button>
      </div>
    </div>
  ),
  popover: () => (
    <div className="g-anchor">
      <IconButton aria-label="정보" variant="secondary" size="sm">
        <Info weight="bold" />
      </IconButton>
      <div className="g-surface g-bubble">
        <p className="g-surface__title">적립금 안내</p>
        <p className="g-surface__text">구매 확정 7일 뒤 지급</p>
      </div>
    </div>
  ),
  tooltip: () => (
    <div className="g-anchor g-anchor--up">
      <span className="g-tip">설정</span>
      <IconButton aria-label="설정" variant="secondary">
        <GearSix weight="bold" />
      </IconButton>
    </div>
  ),
  'dropdown-menu': () => (
    <div className="g-anchor">
      <IconButton aria-label="더보기" variant="secondary" size="sm">
        <DotsThree weight="bold" />
      </IconButton>
      <ul className="g-surface g-menu">
        <li data-active>이름 바꾸기</li>
        <li>복제</li>
        <li className="g-menu__danger">삭제</li>
      </ul>
    </div>
  ),
  toast: () => (
    <div className="g-surface g-toast">
      <CheckCircle weight="fill" className="g-toast__icon" />
      <span>링크를 복사했습니다</span>
      <X weight="bold" className="g-toast__close" />
    </div>
  ),
};
