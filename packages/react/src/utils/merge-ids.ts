/** aria-describedby 처럼 공백으로 구분되는 id 목록을 합친다. 비어 있으면 undefined. */
export function mergeIds(...ids: Array<string | false | null | undefined>): string | undefined {
  const merged = ids.filter(Boolean).join(' ').split(/\s+/).filter(Boolean);
  return merged.length ? Array.from(new Set(merged)).join(' ') : undefined;
}
