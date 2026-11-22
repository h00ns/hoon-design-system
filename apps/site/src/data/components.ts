/** 문서 사이트의 컴포넌트 목록. 갤러리, 페이지 머리말(배지)에서 쓴다. */
export type Category = '동작' | '폼' | '오버레이' | '피드백' | '구조' | '탐색';

export interface ComponentMeta {
  slug: string;
  name: string;
  summary: string;
  category: Category;
  /** Radix 프리미티브 문서 */
  radix?: string;
  /** WAI-ARIA APG 패턴 */
  apg?: string;
}

const radix = (name: string) => `https://www.radix-ui.com/primitives/docs/components/${name}`;
const apg = (name: string) => `https://www.w3.org/WAI/ARIA/apg/patterns/${name}/`;

export const COMPONENTS: ComponentMeta[] = [
  {
    slug: 'button',
    name: 'Button',
    summary: '동작을 실행하는 버튼',
    category: '동작',
    apg: apg('button'),
  },
  {
    slug: 'icon-button',
    name: 'IconButton',
    summary: '아이콘만 있는 정사각형 버튼',
    category: '동작',
    apg: apg('button'),
  },
  { slug: 'field', name: 'Field', summary: '레이블, 설명, 오류를 컨트롤에 연결', category: '폼' },
  { slug: 'input', name: 'Input', summary: '한 줄 텍스트 입력', category: '폼' },
  { slug: 'textarea', name: 'Textarea', summary: '여러 줄 텍스트 입력', category: '폼' },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    summary: '켜고 끄는 선택, 부분 선택 지원',
    category: '폼',
    radix: radix('checkbox'),
    apg: apg('checkbox'),
  },
  {
    slug: 'radio-group',
    name: 'RadioGroup',
    summary: '여러 개 중 하나 고르기',
    category: '폼',
    radix: radix('radio-group'),
    apg: apg('radio'),
  },
  {
    slug: 'switch',
    name: 'Switch',
    summary: '즉시 반영되는 켜기/끄기',
    category: '폼',
    radix: radix('switch'),
    apg: apg('switch'),
  },
  {
    slug: 'select',
    name: 'Select',
    summary: '목록에서 값 하나 고르기',
    category: '폼',
    radix: radix('select'),
    apg: apg('combobox'),
  },
  {
    slug: 'combobox',
    name: 'Combobox',
    summary: '검색하며 값 고르기',
    category: '폼',
    apg: apg('combobox'),
  },
  {
    slug: 'slider',
    name: 'Slider',
    summary: '범위 안에서 값 조절',
    category: '폼',
    radix: radix('slider'),
    apg: apg('slider'),
  },
  {
    slug: 'toggle-group',
    name: 'ToggleGroup',
    summary: '눌림 상태를 가진 버튼 묶음',
    category: '폼',
    radix: radix('toggle-group'),
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    summary: '흐름을 멈추고 집중시키는 창',
    category: '오버레이',
    radix: radix('dialog'),
    apg: apg('dialog-modal'),
  },
  {
    slug: 'alert-dialog',
    name: 'AlertDialog',
    summary: '되돌릴 수 없는 동작 확인',
    category: '오버레이',
    radix: radix('alert-dialog'),
    apg: apg('alertdialog'),
  },
  {
    slug: 'sheet',
    name: 'Sheet',
    summary: '화면 가장자리에서 열리는 패널',
    category: '오버레이',
    radix: radix('dialog'),
    apg: apg('dialog-modal'),
  },
  {
    slug: 'popover',
    name: 'Popover',
    summary: '트리거 옆에 뜨는 비모달 패널',
    category: '오버레이',
    radix: radix('popover'),
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    summary: '짧은 보조 설명',
    category: '오버레이',
    radix: radix('tooltip'),
    apg: apg('tooltip'),
  },
  {
    slug: 'hover-card',
    name: 'HoverCard',
    summary: '링크에 올리면 보이는 미리보기',
    category: '오버레이',
    radix: radix('hover-card'),
  },
  {
    slug: 'dropdown-menu',
    name: 'DropdownMenu',
    summary: '동작 목록 메뉴',
    category: '오버레이',
    radix: radix('dropdown-menu'),
    apg: apg('menu-button'),
  },
  {
    slug: 'toast',
    name: 'Toast',
    summary: '잠깐 나타나는 알림',
    category: '피드백',
    radix: radix('toast'),
  },
  {
    slug: 'alert',
    name: 'Alert',
    summary: '페이지 안의 안내 메시지',
    category: '피드백',
    apg: apg('alert'),
  },
  {
    slug: 'progress',
    name: 'Progress',
    summary: '진행률 표시',
    category: '피드백',
    radix: radix('progress'),
    apg: 'https://www.w3.org/TR/wai-aria-1.2/#progressbar',
  },
  { slug: 'spinner', name: 'Spinner', summary: '끝을 알 수 없는 대기', category: '피드백' },
  { slug: 'skeleton', name: 'Skeleton', summary: '불러올 콘텐츠의 자리 표시', category: '피드백' },
  { slug: 'card', name: 'Card', summary: '관련 정보를 묶는 표면', category: '구조' },
  {
    slug: 'table',
    name: 'Table',
    summary: '행과 열로 된 데이터',
    category: '구조',
    apg: apg('table'),
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    summary: '패널을 나눠 하나씩 보여주기',
    category: '구조',
    radix: radix('tabs'),
    apg: apg('tabs'),
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    summary: '제목을 눌러 펼치는 섹션',
    category: '구조',
    radix: radix('accordion'),
    apg: apg('accordion'),
  },
  {
    slug: 'collapsible',
    name: 'Collapsible',
    summary: '한 영역 펼치고 접기',
    category: '구조',
    radix: radix('collapsible'),
    apg: apg('disclosure'),
  },
  {
    slug: 'scroll-area',
    name: 'ScrollArea',
    summary: '스크롤 영역과 스크롤바',
    category: '구조',
    radix: radix('scroll-area'),
  },
  {
    slug: 'separator',
    name: 'Separator',
    summary: '콘텐츠 구분선',
    category: '구조',
    radix: radix('separator'),
  },
  { slug: 'badge', name: 'Badge', summary: '상태와 분류를 표시하는 라벨', category: '구조' },
  {
    slug: 'avatar',
    name: 'Avatar',
    summary: '사람이나 팀을 나타내는 이미지',
    category: '구조',
    radix: radix('avatar'),
  },
  { slug: 'kbd', name: 'Kbd', summary: '키보드 키 표시', category: '구조' },
  {
    slug: 'visually-hidden',
    name: 'VisuallyHidden',
    summary: '스크린리더만 읽는 텍스트',
    category: '구조',
    radix: radix('visually-hidden'),
  },
  { slug: 'link', name: 'Link', summary: '문장 속 링크', category: '탐색' },
  {
    slug: 'breadcrumb',
    name: 'Breadcrumb',
    summary: '현재 위치까지의 경로',
    category: '탐색',
    apg: apg('breadcrumb'),
  },
  { slug: 'pagination', name: 'Pagination', summary: '여러 페이지 사이 이동', category: '탐색' },
];

export const CATEGORIES: Category[] = ['동작', '폼', '오버레이', '피드백', '구조', '탐색'];

export const findComponent = (slug: string) => COMPONENTS.find((c) => c.slug === slug);
