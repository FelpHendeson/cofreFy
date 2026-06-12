"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Category, CategoryType } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
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
    setError,
    clearErrors,
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

  function applyServerErrors(
    fieldErrors?: Record<string, string[]>,
    message?: string,
  ) {
    clearErrors();
    let hasFieldError = false;

    if (fieldErrors) {
      for (const [field, messages] of Object.entries(fieldErrors)) {
        if (messages?.[0]) {
          setError(field as keyof CategoryFormInput, { message: messages[0] });
          hasFieldError = true;
        }
      }
    }

    if (message) {
      setServerMessage(message);
      return;
    }

    setServerMessage(hasFieldError ? null : "Não foi possível salvar a categoria.");
  }

  function onSubmit(values: CategoryFormInput) {
    setServerMessage(null);
    clearErrors();

    startTransition(async () => {
      const result = isEditing
        ? await updateCategoryAction({
            id: category.id,
            ...values,
            isActive: category.isActive,
          })
        : await createCategoryAction(values);

      if (!result.success) {
        applyServerErrors(result.fieldErrors, result.message);
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
          <Input
            id="name"
            label="Nome"
            placeholder="Ex.: Alimentação"
            error={errors.name?.message}
            {...register("name")}
          />
        </div>

        <Select id="type" label="Tipo" error={errors.type?.message} {...register("type")}>
          {(Object.keys(categoryTypeLabels) as CategoryType[]).map((type) => (
            <option key={type} value={type}>
              {categoryTypeLabels[type]}
            </option>
          ))}
        </Select>

        <Input
          id="color"
          label="Cor (opcional)"
          placeholder="#10b981"
          {...register("color")}
        />

        <div className="md:col-span-2">
          <Input
            id="icon"
            label="Ícone (opcional)"
            placeholder="Ex.: 🛒"
            {...register("icon")}
          />
        </div>
      </div>

      {serverMessage && <p className="mt-4 text-sm text-red-600">{serverMessage}</p>}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar categoria"}
        </Button>

        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
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
