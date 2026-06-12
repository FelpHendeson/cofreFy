import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "./cn";
import { controlBase, controlError } from "./control-styles";
import { Field } from "./Field";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className, ...props },
  ref,
) {
  const input = (
    <input
      ref={ref}
      id={id}
      className={cn(controlBase, error && controlError, className)}
      {...props}
    />
  );

  if (!label && !error && !hint) {
    return input;
  }

  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      {input}
    </Field>
  );
});
