import type { Category } from "@prisma/client";

type CategoryStatusBadgeProps = {
  category: Pick<Category, "isActive" | "isDefault">;
};

export function CategoryStatusBadge({ category }: CategoryStatusBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
          category.isActive
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        {category.isActive ? "Ativa" : "Inativa"}
      </span>
      {category.isDefault && (
        <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          Padrão
        </span>
      )}
    </div>
  );
}
