import { Toggle } from '@hoon-ds/react';
import { useState } from 'react';

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="m10 2.5 2.3 4.7 5.2.8-3.8 3.6.9 5.2L10 14.3l-4.6 2.5.9-5.2L2.5 8l5.2-.8L10 2.5Z" />
    </svg>
  );
}

export default function StandaloneToggleExample() {
  const [starred, setStarred] = useState(false);

  return (
    <>
      <Toggle icon={<StarIcon />} pressed={starred} onPressedChange={setStarred}>
        {starred ? '즐겨찾기됨' : '즐겨찾기'}
      </Toggle>
      <Toggle icon={<StarIcon />} aria-label="즐겨찾기" size="sm" />
      <Toggle disabled>비활성</Toggle>
    </>
  );
}
