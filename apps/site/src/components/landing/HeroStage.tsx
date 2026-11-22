import { Button, Field, Input, Select, Switch, Tabs } from '@hoon-ds/react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * 히어로의 실제 컴포넌트 조합 위로 "포커스 링"이 키보드 순서를 따라 이동한다.
 * - 실제 DOM 포커스는 건드리지 않는다 (사용자의 포커스·스크롤을 빼앗지 않기 위해 링은 오버레이로 그린다)
 * - 사용자가 영역에 들어오면(hover / focus) 투어를 멈추고 직접 조작하게 둔다
 * - prefers-reduced-motion 이면 투어를 하지 않는다
 */

type StepKey = 'tab' | 'input' | 'switch' | 'select' | 'save';

interface Step {
  target: StepKey;
  keys: string[];
  caption: string;
}

const STEPS: Step[] = [
  { target: 'tab', keys: ['→'], caption: '화살표로 탭 이동' },
  { target: 'input', keys: ['Tab'], caption: '다음 컨트롤로' },
  { target: 'switch', keys: ['Tab'], caption: '스위치로 이동' },
  { target: 'switch', keys: ['Space'], caption: '켜기 / 끄기' },
  { target: 'select', keys: ['Tab'], caption: '선택 상자로 이동' },
  { target: 'save', keys: ['Tab'], caption: '저장 버튼으로' },
  { target: 'save', keys: ['Enter'], caption: '저장 실행' },
];

const STEP_MS = 1500;

interface Ring {
  x: number;
  y: number;
  w: number;
  h: number;
  r: string;
}

export default function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const targets = useRef<Partial<Record<StepKey, HTMLElement | null>>>({});
  const [step, setStep] = useState(0);
  const [ring, setRing] = useState<Ring | null>(null);
  const [touring, setTouring] = useState(false);
  const [paused, setPaused] = useState(false);
  const [tab, setTab] = useState('me');
  const [weekly, setWeekly] = useState(false);
  const [saving, setSaving] = useState(false);

  const register = (key: StepKey) => (el: HTMLElement | null) => {
    targets.current[key] = el;
  };

  // 동작 줄이기가 아니고, 화면에 보일 때만 투어
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stage = stageRef.current;
    if (!stage) return;
    let visible = false;
    const update = () => setTouring(visible && !reduce.matches);
    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      update();
    });
    io.observe(stage);
    reduce.addEventListener('change', update);
    return () => {
      io.disconnect();
      reduce.removeEventListener('change', update);
    };
  }, []);

  const active = touring && !paused;

  const measure = useCallback(() => {
    const stage = stageRef.current;
    const current = STEPS[step];
    const el = current && targets.current[current.target];
    if (!stage || !el) return;
    const s = stage.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setRing({
      x: r.left - s.left,
      y: r.top - s.top,
      w: r.width,
      h: r.height,
      r: getComputedStyle(el).borderRadius || '6px',
    });
  }, [step]);

  useLayoutEffect(() => {
    if (!active) return;
    measure();
  }, [active, measure, tab, weekly, saving]);

  useEffect(() => {
    if (!active) return;
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, [active, measure]);

  // 단계 진행 + 각 단계의 "효과"
  useEffect(() => {
    if (!active) return;
    const current = STEPS[step];
    if (current?.target === 'tab') setTab((t) => (t === 'me' ? 'team' : 'me'));
    if (current?.target === 'switch' && current.keys[0] === 'Space') setWeekly((v) => !v);
    if (current?.target === 'save' && current.keys[0] === 'Enter') {
      setSaving(true);
      const done = window.setTimeout(() => setSaving(false), 1100);
      const next = window.setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEP_MS);
      return () => {
        window.clearTimeout(done);
        window.clearTimeout(next);
      };
    }
    const id = window.setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEP_MS);
    return () => window.clearTimeout(id);
  }, [active, step]);

  const current = STEPS[step];

  return (
    <div
      className="hero-stage"
      ref={stageRef}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <Tabs.Root value={tab} onValueChange={setTab} variant="segmented" asChild>
        <section className="hero-card" aria-label="알림 설정 예시 (직접 조작할 수 있습니다)">
          <div className="hero-card__head">
            <h2 className="hero-card__title">알림 설정</h2>
            <Tabs.List aria-label="설정 대상">
              <Tabs.Trigger value="me" ref={register('tab')}>
                개인
              </Tabs.Trigger>
              <Tabs.Trigger value="team">팀</Tabs.Trigger>
            </Tabs.List>
          </div>

          {(['me', 'team'] as const).map((value) => (
            <Tabs.Content key={value} value={value} className="hero-card__body">
              <Field.Root>
                <Field.Label>받을 이메일</Field.Label>
                <Input
                  ref={value === tab ? register('input') : undefined}
                  defaultValue={value === 'me' ? 'hoon@studio.kr' : 'team@studio.kr'}
                  type="email"
                />
              </Field.Root>

              <Switch
                ref={value === tab ? register('switch') : undefined}
                checked={weekly}
                onCheckedChange={setWeekly}
              >
                주간 리포트 받기
              </Switch>

              <Field.Root>
                <Field.Label>알림 빈도</Field.Label>
                <Select.Root defaultValue="daily">
                  <Select.Trigger ref={value === tab ? register('select') : undefined}>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="realtime">실시간</Select.Item>
                    <Select.Item value="daily">하루 한 번</Select.Item>
                    <Select.Item value="weekly">일주일에 한 번</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Field.Root>
            </Tabs.Content>
          ))}

          <div className="hero-card__actions">
            <Button variant="ghost">취소</Button>
            <Button ref={register('save')} loading={saving}>
              저장
            </Button>
          </div>
        </section>
      </Tabs.Root>

      {active && ring && (
        <div
          className="hero-ring"
          aria-hidden="true"
          style={{
            transform: `translate(${ring.x - 4}px, ${ring.y - 4}px)`,
            width: ring.w + 8,
            height: ring.h + 8,
            borderRadius: `calc(${ring.r} + 4px)`,
          }}
        />
      )}

      <div className="hero-hud" aria-hidden="true" data-visible={active || undefined}>
        {current?.keys.map((k) => (
          <kbd key={`${step}-${k}`} className="hero-hud__key">
            {k}
          </kbd>
        ))}
        <span className="hero-hud__caption">{current?.caption}</span>
      </div>
    </div>
  );
}
