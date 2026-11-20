import * as React from 'react';
import { Label as LabelPrimitive } from 'radix-ui';
import { cx } from '../utils/cx';
import { useIsomorphicLayoutEffect } from '../utils/use-isomorphic-layout-effect';
import { FieldContext, useFieldContext } from './field-context';
import type { FieldContextValue } from './field-context';

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

export interface FieldRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 오류 상태. 컨트롤에 `aria-invalid` 를 걸고 `Field.ErrorMessage` 를 보여준다. */
  invalid?: boolean;
  /** 필수 입력. 컨트롤에 `required` 를 걸고 레이블에 시각적 표시(*)를 붙인다. */
  required?: boolean;
  /** 비활성. 컨트롤에 `disabled` 를 건다. */
  disabled?: boolean;
}

const Root = React.forwardRef<HTMLDivElement, FieldRootProps>(function FieldRoot(
  { invalid = false, required = false, disabled = false, className, ...rest },
  ref,
) {
  const baseId = React.useId();
  const [customControlId, setControlId] = React.useState<string | undefined>();
  const [hasDescription, setHasDescription] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const value = React.useMemo<FieldContextValue>(
    () => ({
      controlId: customControlId ?? `${baseId}-control`,
      labelId: `${baseId}-label`,
      descriptionId: `${baseId}-description`,
      errorId: `${baseId}-error`,
      invalid,
      required,
      disabled,
      hasDescription,
      hasError,
      setControlId,
      setHasDescription,
      setHasError,
    }),
    [baseId, customControlId, invalid, required, disabled, hasDescription, hasError],
  );

  return (
    <FieldContext.Provider value={value}>
      <div
        {...rest}
        ref={ref}
        className={cx('hds-field', className)}
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
      />
    </FieldContext.Provider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Label
 * -----------------------------------------------------------------------------------------------*/

export type FieldLabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;

const Label = React.forwardRef<HTMLLabelElement, FieldLabelProps>(function FieldLabel(
  { className, children, ...rest },
  ref,
) {
  const field = useFieldContext();
  return (
    <LabelPrimitive.Root
      id={field?.labelId}
      htmlFor={field?.controlId}
      {...rest}
      ref={ref}
      className={cx('hds-field__label', className)}
    >
      {children}
      {field?.required && (
        // 스크린리더는 컨트롤의 required 로 "필수"를 읽으므로 기호는 숨긴다
        <span className="hds-field__required" aria-hidden="true">
          *
        </span>
      )}
    </LabelPrimitive.Root>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Description
 * -----------------------------------------------------------------------------------------------*/

export type FieldDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const Description = React.forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  function FieldDescription({ className, ...rest }, ref) {
    const field = useFieldContext();
    const setHasDescription = field?.setHasDescription;
    useIsomorphicLayoutEffect(() => {
      setHasDescription?.(true);
      return () => setHasDescription?.(false);
    }, [setHasDescription]);
    return (
      <p
        {...rest}
        id={field?.descriptionId ?? rest.id}
        ref={ref}
        className={cx('hds-field__description', className)}
      />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * ErrorMessage
 * -----------------------------------------------------------------------------------------------*/

export interface FieldErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Field 가 invalid 가 아니어도 항상 렌더링한다. @default false */
  forceMount?: boolean;
}

const ErrorIcon = () => (
  <svg className="hds-field__error-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1Zm0 9.5a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8ZM8 4a.8.8 0 0 0-.8.8v3.9a.8.8 0 0 0 1.6 0V4.8A.8.8 0 0 0 8 4Z" />
  </svg>
);

const ErrorMessage = React.forwardRef<HTMLParagraphElement, FieldErrorMessageProps>(
  function FieldErrorMessage({ forceMount = false, className, children, ...rest }, ref) {
    const field = useFieldContext();
    const visible = forceMount || !field || field.invalid;
    const setHasError = field?.setHasError;
    useIsomorphicLayoutEffect(() => {
      if (!visible) return;
      setHasError?.(true);
      return () => setHasError?.(false);
    }, [visible, setHasError]);

    if (!visible) return null;
    return (
      <p
        {...rest}
        id={field?.errorId ?? rest.id}
        ref={ref}
        className={cx('hds-field__error', className)}
      >
        {/* 색만으로 오류를 전달하지 않도록 아이콘을 함께 쓴다 (WCAG 1.4.1) */}
        <ErrorIcon />
        <span>{children}</span>
      </p>
    );
  },
);

export { Root, Label, Description, ErrorMessage };
