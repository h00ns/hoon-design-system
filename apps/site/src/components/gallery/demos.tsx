/**
 * 컴포넌트 갤러리의 미니 데모. 실제 컴포넌트를 정적으로 렌더링한다 (JS 없이 HTML 로 나간다).
 * 열고 닫는 오버레이는 트리거와 열린 모습의 핵심만 보여준다.
 */
import * as DS from '@hoon-ds/react';
import {
  CheckCircle,
  DotsThree,
  GearSix,
  Info,
  TextB,
  TextItalic,
  TextUnderline,
  X,
} from '@phosphor-icons/react/ssr';
import type { ReactNode } from 'react';

const {
  Breadcrumb,
  Card,
  Collapsible,
  Combobox,
  Kbd,
  Link,
  Pagination,
  Progress,
  ScrollArea,
  Slider,
  Table,
  ToggleGroup,
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
      <Badge tone="critical" variant="solid">
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
        <Button size="sm" variant="critical">
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
        <li className="g-menu__critical">삭제</li>
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

  combobox: () => (
    <div className="g-anchor g-field">
      <Combobox
        aria-label="도시 검색 예시"
        size="sm"
        defaultInputValue="서"
        options={[{ value: 'seoul', label: '서울' }]}
        className="g-field"
      />
      <ul className="g-surface g-menu g-field">
        <li data-active>서울</li>
        <li>서귀포</li>
        <li>서산</li>
      </ul>
    </div>
  ),
  slider: () => (
    <div className="g-field g-col">
      <Slider
        defaultValue={[20000, 60000]}
        min={0}
        max={100000}
        step={1000}
        aria-label="가격 범위 예시"
      />
    </div>
  ),
  'toggle-group': () => (
    <ToggleGroup.Root type="multiple" defaultValue={['bold']} aria-label="글자 스타일 예시">
      <ToggleGroup.Item value="bold" aria-label="굵게">
        <TextB weight="bold" />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="italic" aria-label="기울임">
        <TextItalic weight="bold" />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="underline" aria-label="밑줄">
        <TextUnderline weight="bold" />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
  sheet: () => (
    <div className="g-sheet">
      <div className="g-surface g-sheet__panel">
        <p className="g-surface__title">필터</p>
        <Skeleton style={{ width: '80%' }} />
        <Button size="sm">적용</Button>
      </div>
    </div>
  ),
  'hover-card': () => (
    <div className="g-anchor">
      <Link href="#hover-card">@hoon</Link>
      <div className="g-surface g-bubble g-row" style={{ justifyContent: 'flex-start' }}>
        <Avatar name="김하늘" size="sm" />
        <div>
          <p className="g-surface__title">김하늘</p>
          <p className="g-surface__text">프론트엔드 엔지니어</p>
        </div>
      </div>
    </div>
  ),
  progress: () => (
    <div className="g-field g-col">
      <Progress value={42} label="업로드" showValue size="sm" />
      <Progress value={80} tone="success" aria-label="완료율 예시" size="sm" />
    </div>
  ),
  collapsible: () => (
    <Collapsible.Root defaultOpen className="g-field">
      <Collapsible.Trigger>고급 설정</Collapsible.Trigger>
      <Collapsible.Content className="g-muted">캐시 사용, 로그 수준</Collapsible.Content>
    </Collapsible.Root>
  ),
  'scroll-area': () => (
    <ScrollArea
      type="always"
      style={{ height: 96, width: '100%', maxWidth: 200 }}
      aria-label="목록 예시"
    >
      <ul className="g-list">
        {['서울', '부산', '대구', '인천', '광주', '대전', '울산'].map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </ScrollArea>
  ),
  card: () => (
    <Card.Root className="g-field" padding="sm">
      <Card.Header>
        <Card.Title>프로 요금제</Card.Title>
        <Card.Description>팀 협업 기능 포함</Card.Description>
      </Card.Header>
      <Card.Footer>
        <Button size="sm">시작하기</Button>
      </Card.Footer>
    </Card.Root>
  ),
  table: () => (
    <Table.Root density="compact" className="g-table" aria-label="주문 예시">
      <Table.Header>
        <Table.Row>
          <Table.Head>상품</Table.Head>
          <Table.Head numeric>가격</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>키보드</Table.Cell>
          <Table.Cell numeric>89,000</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>마우스</Table.Cell>
          <Table.Cell numeric>42,000</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  ),
  breadcrumb: () => (
    <Breadcrumb.Root aria-label="경로 예시">
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#home">홈</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#docs">문서</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Page>Button</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  ),
  pagination: () => (
    <div className="g-scale">
      <Pagination count={5} defaultPage={2} size="sm" aria-label="페이지 예시" />
    </div>
  ),
  link: () => (
    <p className="g-muted" style={{ margin: 0 }}>
      자세한 내용은 <Link href="#guide">사용 가이드</Link>를 보세요.
    </p>
  ),
  kbd: () => (
    <div className="g-row">
      <Kbd keys={['⌘', 'K']} />
      <Kbd>Esc</Kbd>
    </div>
  ),
};
