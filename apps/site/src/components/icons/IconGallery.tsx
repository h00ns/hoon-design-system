import * as Icons from '@hoon-ds/icons';
import { CheckIcon, SearchIcon, type Icon, type IconWeight } from '@hoon-ds/icons';
import { ICON_CATEGORIES, ICON_META, type IconCategory } from '@hoon-ds/icons/meta';
import { Input, ToggleGroup, VisuallyHidden } from '@hoon-ds/react';
import { useEffect, useMemo, useRef, useState } from 'react';

const registry = Icons as unknown as Record<string, Icon>;
const SIZES = ['20', '24', '32'] as const;

function matches(query: string, haystack: string) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export default function IconGallery() {
  const [query, setQuery] = useState('');
  const [weight, setWeight] = useState<IconWeight>('regular');
  const [size, setSize] = useState<(typeof SIZES)[number]>('24');
  const [copied, setCopied] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const timer = useRef<number | undefined>(undefined);

  const groups = useMemo(() => {
    const found = ICON_META.filter((m) =>
      matches(query, `${m.name} ${m.component} ${m.tags.join(' ')}`.toLowerCase()),
    );
    return (Object.keys(ICON_CATEGORIES) as IconCategory[])
      .map((category) => ({ category, items: found.filter((m) => m.category === category) }))
      .filter((g) => g.items.length > 0);
  }, [query]);
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  // 결과 수는 입력이 멈춘 뒤에 한 번만 알린다 (글자마다 읽히지 않게)
  useEffect(() => {
    if (!query) return;
    const id = window.setTimeout(
      () => setAnnouncement(total ? `아이콘 ${total}개를 찾았습니다` : '찾는 아이콘이 없습니다'),
      600,
    );
    return () => window.clearTimeout(id);
  }, [query, total]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy(component: string) {
    const snippet =
      weight === 'regular' ? `<${component} />` : `<${component} weight="${weight}" />`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(component);
      setAnnouncement(`${snippet} 를 복사했습니다`);
    } catch {
      setAnnouncement('복사하지 못했습니다');
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(null), 1400);
  }

  return (
    <div className="not-content icon-gallery">
      <div className="icon-gallery__toolbar">
        <Input
          type="search"
          aria-label="아이콘 검색"
          placeholder="이름이나 용도로 검색 (예: 삭제, arrow)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          startSlot={<SearchIcon aria-hidden />}
          className="icon-gallery__search"
        />
        <ToggleGroup.Root
          type="single"
          size="sm"
          aria-label="굵기"
          value={weight}
          onValueChange={(v) => v && setWeight(v as IconWeight)}
        >
          <ToggleGroup.Item value="regular">Regular</ToggleGroup.Item>
          <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
          <ToggleGroup.Item value="fill">Fill</ToggleGroup.Item>
        </ToggleGroup.Root>
        <ToggleGroup.Root
          type="single"
          size="sm"
          aria-label="크기"
          value={size}
          onValueChange={(v) => v && setSize(v as (typeof SIZES)[number])}
        >
          {SIZES.map((s) => (
            <ToggleGroup.Item key={s} value={s}>
              {s}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </div>

      <p className="icon-gallery__hint">
        {query ? `${total}개` : `${ICON_META.length}개`} · 누르면 JSX 를 복사합니다
      </p>

      {groups.map(({ category, items }) => (
        <section
          key={category}
          className="icon-gallery__group"
          aria-labelledby={`icons-${category}`}
        >
          <h3 id={`icons-${category}`} className="icon-gallery__heading">
            {ICON_CATEGORIES[category]}
            <span className="icon-gallery__count">{items.length}</span>
          </h3>
          <ul className="icon-gallery__grid">
            {items.map((m) => {
              const Glyph = registry[m.component]!;
              const done = copied === m.component;
              return (
                <li key={m.name}>
                  <button
                    type="button"
                    className="icon-gallery__tile"
                    data-copied={done ? '' : undefined}
                    onClick={() => copy(m.component)}
                    title={m.tags.join(', ')}
                  >
                    <span className="icon-gallery__glyph">
                      {done ? (
                        <CheckIcon size={Number(size)} weight="bold" />
                      ) : (
                        <Glyph size={Number(size)} weight={weight} />
                      )}
                    </span>
                    <span className="icon-gallery__name">{m.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {total === 0 && (
        <p className="icon-gallery__empty">
          “{query}” 에 맞는 아이콘이 없습니다. 다른 낱말이나 영어로 검색해 보세요.
        </p>
      )}

      <VisuallyHidden role="status" aria-live="polite">
        {announcement}
      </VisuallyHidden>
    </div>
  );
}
