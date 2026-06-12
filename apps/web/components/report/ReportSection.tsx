import type { ReactNode } from "react";
import { cn } from "@/components/ui/cn";

type ReportSectionProps = {
  title: string;
  emptyMessage?: string;
  isEmpty?: boolean;
  borderClassName?: string;
  titleClassName?: string;
  children: ReactNode;
};

export function ReportSection({
  title,
  emptyMessage,
  isEmpty = false,
  borderClassName,
  titleClassName,
  children,
}: ReportSectionProps) {
  return (
    <section
      className={cn(
        "rounded-xl border bg-white p-6 shadow-sm",
        borderClassName ?? "border-slate-200",
      )}
    >
      <h2 className={cn("text-lg font-semibold text-slate-900", titleClassName)}>{title}</h2>

      {isEmpty && emptyMessage ? (
        <p className="mt-4 text-sm text-slate-500">{emptyMessage}</p>
      ) : (
        children
      )}
    </section>
  );
}
