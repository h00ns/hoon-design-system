import { Alert, Button, Switch } from '@hoon-ds/react';
import { useState } from 'react';

/** 같은 등장 애니메이션을 "동작 줄이기" 설정 유무로 비교한다. */
export default function MotionDemo() {
  const [reduce, setReduce] = useState(false);
  const [run, setRun] = useState(0);

  return (
    <div className="motion-demo">
      <div className="motion-demo__stage">
        <div key={run} className="motion-demo__item" data-reduce={reduce || undefined}>
          <Alert tone="success" title="저장했습니다" />
        </div>
      </div>
      <div className="motion-demo__controls">
        <Switch size="sm" checked={reduce} onCheckedChange={setReduce}>
          동작 줄이기
        </Switch>
        <Button size="sm" variant="secondary" onClick={() => setRun((n) => n + 1)}>
          다시 보기
        </Button>
      </div>
    </div>
  );
}
