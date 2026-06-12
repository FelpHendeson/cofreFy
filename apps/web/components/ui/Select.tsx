import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "./cn";
import { controlBase, controlError } from "./control-styles";
import { Field } from "./Field";
import { SelectChevron } from "./SelectChevron";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, id, className, children, ...props },
  ref,
) {
  const select = (
    <div className="relative">
      <select
        ref={ref}
        id={id}
        className={cn(
          controlBase,
          "cursor-pointer appearance-none pr-10",
          error && controlError,
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <SelectChevron />
    </div>
  );

  if (!label && !error && !hint) {
    return select;
  }

  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      {select}
    </Field>
  );
});
