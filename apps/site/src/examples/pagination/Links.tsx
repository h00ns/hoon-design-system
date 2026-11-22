import { Pagination } from '@hoon-ds/react';

export default function LinksExample() {
  // 페이지마다 URL 이 있으면 링크로 렌더링한다. 라우터 컴포넌트는 linkAs 로 넘긴다.
  return <Pagination count={8} page={3} getHref={(page) => `?page=${page}`} />;
}
