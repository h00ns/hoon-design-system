import { Toaster } from '@hoon-ds/react';

/**
 * 이 문서 페이지 전체에서 한 번만 마운트되는 Toaster.
 * 실제 앱에서도 Toaster 는 최상단(레이아웃)에 한 번만 두고, 어디서든 toast() 를 호출한다.
 */
export default function ToasterIsland() {
  return <Toaster />;
}
