// MDX 본문의 내부 절대 링크("/components/button/")에 사이트 base 경로를 붙인다.
// GitHub Pages 는 /<저장소 이름>/ 아래에서 서비스되므로, 문서에서는 base 없이 쓰고 빌드 때 보정한다.
// 마크다운 링크와 JSX 컴포넌트(LinkCard 등)의 href 속성 모두 처리한다.

/** @param {{ base: string }} options */
export default function rehypeBaseLinks({ base }) {
  const prefix = base.replace(/\/$/, '');

  /** @param {unknown} href */
  const withBase = (href) =>
    typeof href === 'string' &&
    prefix &&
    href.startsWith('/') &&
    !href.startsWith('//') &&
    href !== prefix &&
    !href.startsWith(`${prefix}/`)
      ? `${prefix}${href}`
      : href;

  /** @param {any} node */
  const walk = (node) => {
    if (node.type === 'element' && node.tagName === 'a' && node.properties?.href) {
      node.properties.href = withBase(node.properties.href);
    }
    if (
      (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
      Array.isArray(node.attributes)
    ) {
      for (const attr of node.attributes) {
        if (attr.type === 'mdxJsxAttribute' && attr.name === 'href')
          attr.value = withBase(attr.value);
      }
    }
    if (Array.isArray(node.children)) node.children.forEach(walk);
  };

  return (/** @type {any} */ tree) => walk(tree);
}
