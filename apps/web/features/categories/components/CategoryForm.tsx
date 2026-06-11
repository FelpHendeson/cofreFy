"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Category, CategoryType } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  createCategoryAction,
  updateCategoryAction,
} from "../actions/category.actions";
import {
  categoryFormSchema,
  type CategoryFormInput,
} from "../schemas/category.schema";
import { categoryTypeLabels } from "../utils/category-labels";

type CategoryFormProps = {
  category?: Category;
  variant?: "card" | "modal";
  onCancel?: () => void;
  onSuccess?: () => void;
};

const defaultValues: CategoryFormInput = {
  name: "",
  type: "EXPENSE",
  color: undefined,
  icon: undefined,
};

export function CategoryForm({
  category,
  variant = "card",
  onCancel,
  onSuccess,
}: CategoryFormProps) {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isEditing = !!category;
  const isModal = variant === "modal";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        type: category.type,
        color: category.color ?? undefined,
        icon: category.icon ?? undefined,
        isActive: category.isActive,
      });
      return;
    }

    reset(defaultValues);
  }, [category, reset]);

  function onSubmit(values: CategoryFormInput) {
    setServerMessage(null);

    startTransition(async () => {
      const result = isEditing
        ? await updateCategoryAction({
            id: category.id,
            ...values,
            isActive: category.isActive,
          })
        : await createCategoryAction(values);

      if (!result.success) {
        setServerMessage(result.message ?? "Não foi possível salvar a categoria.");
        return;
      }

      if (!isEditing) {
        reset(defaultValues);
      }

      onSuccess?.();
    });
  }

  const formContent = (
    <>
      {!isModal && (
        <h2 className="text-lg font-semibold text-slate-900">
          {isEditing ? "Editar categoria" : "Nova categoria"}
        </h2>
      )}

      <div className={`grid gap-4 md:grid-cols-2 ${isModal ? "" : "mt-4"}`}>
        <div className="md:col-span-2">
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Nome
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Ex.: Alimentação"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="mb-1 block text-sm font-medium text-slate-700">
            Tipo
          </label>
          <select
            id="type"
            {...register("type")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {(Object.keys(categoryTypeLabels) as CategoryType[]).map((type) => (
              <option key={type} value={type}>
                {categoryTypeLabels[type]}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="color" className="mb-1 block text-sm font-medium text-slate-700">
            Cor (opcional)
          </label>
          <input
            id="color"
            type="text"
            {...register("color")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="#10b981"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="icon" className="mb-1 block text-sm font-medium text-slate-700">
            Ícone (opcional)
          </label>
          <input
            id="icon"
            type="text"
            {...register("icon")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Ex.: 🛒"
          />
        </div>
      </div>

      {serverMessage && (
        <p className="mt-4 text-sm text-red-600">{serverMessage}</p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar categoria"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </>
  );

  if (isModal) {
    return <form onSubmit={handleSubmit(onSubmit)}>{formContent}</form>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {formContent}
    </form>
  );
}
