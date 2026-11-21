import { Button, DropdownMenu } from '@hoon-ds/react';
import { useState } from 'react';

export default function CheckboxAndRadioExample() {
  const [showGrid, setShowGrid] = useState(true);
  const [showRuler, setShowRuler] = useState(false);
  const [sort, setSort] = useState('recent');

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">보기</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        <DropdownMenu.Group aria-labelledby="view-display-label">
          <DropdownMenu.Label id="view-display-label">표시</DropdownMenu.Label>
          <DropdownMenu.CheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
            격자
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem checked={showRuler} onCheckedChange={setShowRuler}>
            눈금자
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Label id="view-sort-label">정렬</DropdownMenu.Label>
        <DropdownMenu.RadioGroup
          aria-labelledby="view-sort-label"
          value={sort}
          onValueChange={setSort}
        >
          <DropdownMenu.RadioItem value="recent">최근 수정순</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="name">이름순</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="size">크기순</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
