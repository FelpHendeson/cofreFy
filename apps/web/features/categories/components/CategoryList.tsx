"use client";

import type { Category } from "@prisma/client";
import { useState, useTransition } from "react";
import {
  deactivateCategoryAction,
  reactivateCategoryAction,
} from "../actions/category.actions";
import { categoryTypeLabels } from "../utils/category-labels";
import { CategoryForm } from "./CategoryForm";
import { CategoryStatusBadge } from "./CategoryStatusBadge";

type CategoryListProps = {
  categories: Category[];
};

export function CategoryList({ categories }: CategoryListProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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

    setActionMessage(null);

    startTransition(async () => {
      const result =
        action === "deactivate"
          ? await deactivateCategoryAction(category.id)
          : await reactivateCategoryAction(category.id);

      setActionMessage(
        result.message ??
          (result.success
            ? "Status atualizado com sucesso."
            : "Não foi possível atualizar o status."),
      );

      if (result.success && editingCategory?.id === category.id) {
        setEditingCategory(null);
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
      {actionMessage && (
        <p
          className={`text-sm ${
            actionMessage.includes("sucesso") ? "text-emerald-700" : "text-red-600"
          }`}
        >
          {actionMessage}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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
                      onClick={() => setEditingCategory(category)}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Editar
                    </button>
                    {category.isActive ? (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleStatusChange(category, "deactivate")}
                        className="rounded-md border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50 disabled:opacity-60"
                      >
                        Inativar
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleStatusChange(category, "reactivate")}
                        className="rounded-md border border-emerald-300 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-60"
                      >
                        Reativar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingCategory && (
        <CategoryForm
          category={editingCategory}
          onCancel={() => setEditingCategory(null)}
          onSuccess={() => setEditingCategory(null)}
        />
      )}
    </div>
  );
}
