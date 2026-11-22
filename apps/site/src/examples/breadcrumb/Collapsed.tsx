import { Breadcrumb, DropdownMenu } from '@hoon-ds/react';

const HIDDEN = [
  { href: '#settings', label: '설정' },
  { href: '#security', label: '보안' },
  { href: '#sign-in', label: '로그인 방식' },
];

export default function CollapsedExample() {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#home">홈</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          {/* 중간 경로를 접고, 메뉴로 펼쳐 볼 수 있게 한다 */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Breadcrumb.Ellipsis />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">
              {HIDDEN.map((item) => (
                <DropdownMenu.Item key={item.href} asChild>
                  <a href={item.href}>{item.label}</a>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Page>2단계 인증</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
