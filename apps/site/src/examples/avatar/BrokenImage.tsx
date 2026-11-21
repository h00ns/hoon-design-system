import { Avatar } from '@hoon-ds/react';

export default function BrokenImageExample() {
  // 일부러 존재하지 않는 주소를 넣어, 로드에 실패하면 이니셜로 대체되는 것을 보여준다
  return <Avatar src="/does-not-exist.png" name="김철수" />;
}
