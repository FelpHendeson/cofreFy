"use client";

import type { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  deactivateCategoryAction,
  reactivateCategoryAction,
} from "../actions/category.actions";
import { categoryTypeLabels } from "../utils/category-labels";
import { CategoryStatusBadge } from "./CategoryStatusBadge";

type CategoryListProps = {
  categories: Category[];
  onEdit: (category: Category) => void;
};

type ActionFeedback = {
  message: string;
  success: boolean;
};

export function CategoryList({ categories, onEdit }: CategoryListProps) {
  const router = useRouter();
  const [actionFeedback, setActionFeedback] = useState<ActionFeedback | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!actionFeedback) {
      return;
    }

    const timeout = window.setTimeout(() => setActionFeedback(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [actionFeedback]);

  function handleStatusChange(
    category: Category,
    action: "deactivate" | "reactivate",
  ) {
    if (
      action === "deactivate" &&
      category.isDefault &&
      !window.confirm(
        `"${category.name}" é uma categoria padrão do sistema. Deseja inativá-la mesmo assim?`,
      )
    ) {
      return;
    }

    setActionFeedback(null);

    startTransition(async () => {
      const result =
        action === "deactivate"
          ? await deactivateCategoryAction(category.id)
          : await reactivateCategoryAction(category.id);

      setActionFeedback({
        message:
          result.message ??
          (result.success
            ? "Status atualizado com sucesso."
            : "Não foi possível atualizar o status."),
        success: result.success,
      });

      if (result.success) {
        router.refresh();
      }
    });
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Nenhuma categoria encontrada para o filtro selecionado.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actionFeedback && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-lg border px-4 py-3 text-sm ${
            actionFeedback.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {actionFeedback.message}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Nome</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Tipo</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Cor</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Ícone</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{category.name}</div>
                  {category.isDefault && (
                    <p className="mt-0.5 text-xs text-blue-600">
                      Categoria protegida do sistema
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {categoryTypeLabels[category.type]}
                </td>
                <td className="px-4 py-3">
                  <CategoryStatusBadge category={category} />
                </td>
                <td className="px-4 py-3 text-slate-600">{category.color ?? "—"}</td>
                <td className="px-4 py-3 text-slate-600">{category.icon ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                    >
                      Editar
                    </button>
                    {category.isActive ? (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleStatusChange(category, "deactivate")}
                        className="rounded-md border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isPending ? "..." : "Inativar"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleStatusChange(category, "reactivate")}
                        className="rounded-md border border-emerald-300 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isPending ? "..." : "Reativar"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
