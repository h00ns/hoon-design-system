import { Input } from '@hoon-ds/react';

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="9" cy="9" r="5.5" />
      <path d="m13.5 13.5 3.5 3.5" strokeLinecap="round" />
    </svg>
  );
}

export default function SlotsExample() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 360 }}>
      {/* 장식 아이콘은 aria-hidden */}
      <Input
        type="search"
        aria-label="상품 검색"
        placeholder="검색어 입력"
        startSlot={<SearchIcon />}
      />
      {/* 의미 있는 단위는 레이블에도 포함한다 */}
      <Input aria-label="금액 (원)" inputMode="numeric" placeholder="0" endSlot="원" />
      <Input aria-label="도메인" placeholder="my-site" startSlot="https://" endSlot=".com" />
    </div>
  );
}
