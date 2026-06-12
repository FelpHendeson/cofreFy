import { cn } from "@/components/ui/cn";

type EmptyStateProps = {
  message: string;
  className?: string;
};

export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "mb-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600",
        className,
      )}
    >
      {message}
    </div>
  );
}
