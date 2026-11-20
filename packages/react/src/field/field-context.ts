import * as React from 'react';
import { mergeIds } from '../utils/merge-ids';
import { useIsomorphicLayoutEffect } from '../utils/use-isomorphic-layout-effect';

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

export interface FieldContextValue {
  controlId: string;
  labelId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
  hasDescription: boolean;
  hasError: boolean;
  setControlId: (id: string | undefined) => void;
  setHasDescription: (value: boolean) => void;
  setHasError: (value: boolean) => void;
}

export const FieldContext = React.createContext<FieldContextValue | null>(null);

/** Field 안에 있으면 컨텍스트를, 밖이면 null 을 돌려준다. */
export function useFieldContext(): FieldContextValue | null {
  return React.useContext(FieldContext);
}

/* -------------------------------------------------------------------------------------------------
 * useFieldControl
 * -----------------------------------------------------------------------------------------------*/

export interface FieldControlProps {
  id?: string;
  disabled?: boolean;
  required?: boolean;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
}

export interface UseFieldControlOptions {
  /**
   * `<label for>` 로 연결할 수 없는 컨트롤(radiogroup 등)은 `aria-labelledby` 로 레이블을 연결한다.
   * @default false
   */
  labelledBy?: boolean;
}

/**
 * 컨트롤 컴포넌트(Input, Checkbox, Select …)가 Field 와 연결되기 위해 쓰는 훅.
 * Field 밖에서는 받은 props 를 그대로 돌려준다. 컨트롤이 직접 받은 값이 항상 우선한다.
 */
export function useFieldControl(
  props: FieldControlProps,
  options: UseFieldControlOptions = {},
): Required<Pick<FieldControlProps, 'id'>> & Omit<FieldControlProps, 'id'> {
  const field = useFieldContext();
  const fallbackId = React.useId();
  const setControlId = field?.setControlId;

  useIsomorphicLayoutEffect(() => {
    if (!setControlId || !props.id) return;
    setControlId(props.id);
    return () => setControlId(undefined);
  }, [setControlId, props.id]);

  if (!field) {
    return { ...props, id: props.id ?? fallbackId };
  }

  const invalid = props['aria-invalid'] ?? (field.invalid ? true : undefined);
  return {
    id: props.id ?? field.controlId,
    disabled: props.disabled ?? (field.disabled || undefined),
    required: props.required ?? (field.required || undefined),
    'aria-invalid': invalid,
    'aria-describedby': mergeIds(
      props['aria-describedby'],
      field.hasDescription && field.descriptionId,
      field.invalid && field.hasError && field.errorId,
    ),
    'aria-labelledby': options.labelledBy
      ? mergeIds(props['aria-labelledby'], field.labelId)
      : props['aria-labelledby'],
  };
}
