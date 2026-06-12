import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "./cn";
import { controlBase, controlError } from "./control-styles";
import { Field } from "./Field";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, id, className, ...props },
  ref,
) {
  const textarea = (
    <textarea
      ref={ref}
      id={id}
      className={cn(controlBase, "min-h-[6rem] resize-y", error && controlError, className)}
      {...props}
    />
  );

  if (!label && !error && !hint) {
    return textarea;
  }

  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      {textarea}
    </Field>
  );
});
