/**
 * 큐레이션한 아이콘 목록.
 * - name: 우리 쪽 이름(kebab-case). 컴포넌트 이름은 PascalCase + "Icon" 이 된다.
 * - source: Phosphor Icons(MIT)의 원본 이름.
 * - tags: 문서 검색용 키워드 (한국어·영어).
 *
 * 아이콘을 추가하려면 여기에 한 줄을 넣고 `pnpm --filter @hoon-ds/icons generate` 를 실행한다.
 */
export const CATEGORIES = {
  arrows: '방향',
  actions: '동작',
  status: '상태',
  navigation: '탐색·레이아웃',
  content: '파일·편집',
  communication: '커뮤니케이션',
  people: '사용자',
  media: '미디어',
  commerce: '커머스',
  system: '시스템·기기',
};

const arrows = [
  ['chevron-down', 'caret-down', '아래 펼치기 드롭다운 expand'],
  ['chevron-up', 'caret-up', '위 접기 collapse'],
  ['chevron-left', 'caret-left', '왼쪽 이전 previous back'],
  ['chevron-right', 'caret-right', '오른쪽 다음 next forward'],
  ['chevrons-left', 'caret-double-left', '처음 first'],
  ['chevrons-right', 'caret-double-right', '마지막 last'],
  ['chevron-up-down', 'caret-up-down', '정렬 선택 sort select'],
  ['arrow-down', 'arrow-down', '아래 down'],
  ['arrow-up', 'arrow-up', '위 up'],
  ['arrow-left', 'arrow-left', '왼쪽 뒤로 back'],
  ['arrow-right', 'arrow-right', '오른쪽 앞으로 forward'],
  ['arrow-up-right', 'arrow-up-right', '외부 링크 external'],
  ['arrow-square-out', 'arrow-square-out', '새 창 외부 링크 external open'],
  ['arrows-down-up', 'arrows-down-up', '정렬 sort swap'],
  ['arrow-clockwise', 'arrow-clockwise', '새로고침 다시 refresh reload redo'],
  ['arrow-counter-clockwise', 'arrow-counter-clockwise', '되돌리기 실행 취소 undo reset'],
  ['arrows-out', 'arrows-out', '전체 화면 확대 fullscreen expand maximize'],
  ['arrows-in', 'arrows-in', '전체 화면 종료 축소 minimize collapse'],
];

const actions = [
  ['plus', 'plus', '추가 더하기 add new create'],
  ['minus', 'minus', '빼기 제거 remove subtract'],
  ['close', 'x', '닫기 취소 삭제 x close dismiss cancel'],
  ['check', 'check', '확인 완료 체크 done ok'],
  ['search', 'magnifying-glass', '검색 찾기 find'],
  ['filter', 'funnel', '필터 거르기 funnel'],
  ['sliders', 'sliders-horizontal', '설정 조정 옵션 options adjust'],
  ['pencil', 'pencil-simple', '수정 편집 edit write'],
  ['trash', 'trash', '삭제 휴지통 delete remove bin'],
  ['copy', 'copy', '복사 복제 duplicate clipboard'],
  ['clipboard', 'clipboard-text', '클립보드 붙여넣기 paste'],
  ['download', 'download-simple', '다운로드 내려받기 save'],
  ['upload', 'upload-simple', '업로드 올리기'],
  ['share', 'share-network', '공유 share'],
  ['export', 'export', '내보내기 공유 export'],
  ['link', 'link', '링크 연결 url'],
  ['link-break', 'link-break', '링크 해제 unlink'],
  ['sign-in', 'sign-in', '로그인 login'],
  ['sign-out', 'sign-out', '로그아웃 logout'],
  ['lock', 'lock', '잠금 비공개 보안 private secure'],
  ['lock-open', 'lock-open', '잠금 해제 공개 unlock'],
  ['eye', 'eye', '보기 표시 비밀번호 show visible'],
  ['eye-slash', 'eye-slash', '숨기기 가리기 비밀번호 hide hidden'],
  ['star', 'star', '즐겨찾기 별 평점 favorite rating'],
  ['heart', 'heart', '좋아요 찜 like favorite'],
  ['bookmark', 'bookmark-simple', '북마크 저장 save'],
  ['pin', 'push-pin', '고정 핀 pin'],
  ['drag-handle', 'dots-six-vertical', '드래그 이동 손잡이 drag reorder grip'],
  ['dots-horizontal', 'dots-three', '더보기 메뉴 more options'],
  ['dots-vertical', 'dots-three-vertical', '더보기 메뉴 more options kebab'],
  ['power', 'power', '전원 종료 off'],
];

const status = [
  ['info', 'info', '정보 안내 information'],
  ['warning', 'warning', '경고 주의 caution alert'],
  ['warning-circle', 'warning-circle', '오류 경고 error alert'],
  ['x-circle', 'x-circle', '오류 실패 error failed'],
  ['check-circle', 'check-circle', '성공 완료 success done'],
  ['question', 'question', '도움말 질문 help'],
  ['prohibit', 'prohibit', '금지 차단 blocked disabled'],
  ['circle-notch', 'circle-notch', '로딩 진행 loading spinner'],
  ['spinner', 'spinner-gap', '로딩 대기 loading'],
  ['bell', 'bell', '알림 notification'],
  ['bell-slash', 'bell-slash', '알림 끄기 mute'],
  ['seal-check', 'seal-check', '인증 확인 verified badge'],
  ['shield-check', 'shield-check', '보안 안전 secure safe'],
  ['sparkle', 'sparkle', '새로운 AI 강조 new magic'],
  ['lightning', 'lightning', '빠른 번개 fast flash'],
];

const navigation = [
  ['menu', 'list', '메뉴 햄버거 menu hamburger'],
  ['house', 'house', '홈 집 home'],
  ['grid', 'squares-four', '그리드 대시보드 앱 grid dashboard apps'],
  ['list-bullets', 'list-bullets', '목록 리스트 list'],
  ['sidebar', 'sidebar-simple', '사이드바 패널 panel'],
  ['layout', 'layout', '레이아웃 화면 구성 layout'],
  ['gear', 'gear', '설정 환경설정 settings preferences'],
  ['globe', 'globe', '언어 웹 지구 language web world'],
  ['map-pin', 'map-pin', '위치 장소 지도 location place'],
  ['compass', 'compass', '탐색 둘러보기 explore'],
  ['hash', 'hash', '채널 태그 해시 channel tag'],
  ['tag', 'tag', '태그 라벨 label'],
  ['funnel-x', 'funnel-x', '필터 해제 clear filter'],
];

const content = [
  ['file', 'file', '파일 문서 file document'],
  ['file-text', 'file-text', '문서 텍스트 document'],
  ['file-plus', 'file-plus', '새 파일 new file'],
  ['folder', 'folder', '폴더 디렉터리 directory'],
  ['folder-open', 'folder-open', '열린 폴더 open folder'],
  ['image', 'image', '이미지 사진 그림 picture photo'],
  ['paperclip', 'paperclip', '첨부 파일 attachment'],
  ['note', 'note-pencil', '메모 노트 note'],
  ['calendar', 'calendar-blank', '달력 일정 날짜 date schedule'],
  ['clock', 'clock', '시간 시계 time'],
  ['code', 'code', '코드 개발 code dev'],
  ['text-bold', 'text-b', '굵게 bold'],
  ['text-italic', 'text-italic', '기울임 italic'],
  ['text-underline', 'text-underline', '밑줄 underline'],
  ['text-align-left', 'text-align-left', '왼쪽 정렬 align'],
  ['table', 'table', '표 테이블 table'],
  ['chart-bar', 'chart-bar', '차트 통계 막대 chart stats'],
  ['chart-line', 'chart-line-up', '차트 추이 상승 chart trend'],
  ['archive', 'archive', '보관 아카이브 archive'],
];

const communication = [
  ['envelope', 'envelope-simple', '메일 이메일 편지 mail email'],
  ['chat', 'chat-circle', '채팅 대화 메시지 chat message'],
  ['chats', 'chats', '대화 여러 메시지 conversation'],
  ['phone', 'phone', '전화 통화 call'],
  ['paper-plane', 'paper-plane-tilt', '보내기 전송 send'],
  ['at', 'at', '멘션 이메일 mention'],
  ['megaphone', 'megaphone', '공지 광고 announcement'],
];

const people = [
  ['user', 'user', '사용자 사람 프로필 person profile account'],
  ['user-circle', 'user-circle', '계정 프로필 avatar account'],
  ['users', 'users', '사용자들 그룹 팀 team group'],
  ['user-plus', 'user-plus', '초대 사용자 추가 invite add'],
  ['user-minus', 'user-minus', '사용자 제거 remove'],
  ['identification-card', 'identification-card', '신분증 ID 카드 identity'],
];

const media = [
  ['play', 'play', '재생 play'],
  ['pause', 'pause', '일시정지 pause'],
  ['stop', 'stop', '정지 stop'],
  ['skip-back', 'skip-back', '이전 곡 previous'],
  ['skip-forward', 'skip-forward', '다음 곡 next'],
  ['speaker-high', 'speaker-high', '소리 볼륨 sound volume'],
  ['speaker-slash', 'speaker-slash', '음소거 mute'],
  ['microphone', 'microphone', '마이크 녹음 mic record'],
  ['camera', 'camera', '카메라 사진 photo'],
  ['video-camera', 'video-camera', '영상 비디오 video'],
];

const commerce = [
  ['shopping-cart', 'shopping-cart', '장바구니 카트 cart'],
  ['shopping-bag', 'shopping-bag', '쇼핑백 구매 bag'],
  ['credit-card', 'credit-card', '카드 결제 payment'],
  ['receipt', 'receipt', '영수증 주문 내역 order'],
  ['gift', 'gift', '선물 혜택 gift'],
  ['storefront', 'storefront', '상점 매장 store shop'],
  ['truck', 'truck', '배송 택배 delivery shipping'],
  ['package', 'package', '상품 패키지 박스 box'],
  ['coin', 'coin', '포인트 돈 동전 money point'],
  ['percent', 'percent', '할인 퍼센트 discount sale'],
];

const system = [
  ['sun', 'sun', '라이트 모드 해 light mode'],
  ['moon', 'moon', '다크 모드 달 dark mode'],
  ['desktop', 'desktop', '데스크톱 시스템 모니터 computer system'],
  ['device-mobile', 'device-mobile', '모바일 휴대폰 phone'],
  ['wifi', 'wifi-high', '와이파이 네트워크 network'],
  ['database', 'database', '데이터베이스 저장소 storage'],
  ['cloud', 'cloud', '클라우드 구름 cloud'],
  ['keyboard', 'keyboard', '키보드 단축키 shortcut'],
  ['cursor-click', 'cursor-click', '클릭 커서 click'],
  ['wheelchair', 'wheelchair', '접근성 휠체어 accessibility a11y'],
  ['translate', 'translate', '번역 언어 translate language'],
  ['github', 'github-logo', '깃허브 github'],
];

const groups = {
  arrows,
  actions,
  status,
  navigation,
  content,
  communication,
  people,
  media,
  commerce,
  system,
};

export const ICONS = Object.entries(groups).flatMap(([category, list]) =>
  list.map(([name, source, tags]) => ({ name, source, category, tags: tags.split(' ') })),
);
