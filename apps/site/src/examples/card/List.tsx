import { Card } from '@hoon-ds/react';

const POSTS = [
  {
    slug: 'focus',
    title: '포커스 링 설계하기',
    summary: '보이고, 대비가 충분하고, 잘리지 않는 링',
  },
  {
    slug: 'forms',
    title: '오류 메시지 연결하기',
    summary: 'aria-describedby 와 aria-invalid 의 역할',
  },
  { slug: 'motion', title: '동작 줄이기 대응', summary: '움직임을 끄지 않고 줄이는 방법' },
];

export default function ListExample() {
  return (
    <ul
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 16,
        width: '100%',
        margin: 0,
        padding: 0,
        listStyle: 'none',
      }}
    >
      {POSTS.map((post) => (
        <Card.Root key={post.slug} asChild interactive padding="sm">
          <li>
            <Card.Title>
              <Card.Link href={`#${post.slug}`}>{post.title}</Card.Link>
            </Card.Title>
            <Card.Description>{post.summary}</Card.Description>
          </li>
        </Card.Root>
      ))}
    </ul>
  );
}
