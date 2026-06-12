"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Category, TransactionType } from "@prisma/client";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  createTransactionAction,
  updateTransactionAction,
} from "../actions/transaction.actions";
import {
  transactionFormSchema,
  type TransactionFormInput,
} from "../schemas/transaction.schema";
import type { TransactionWithCategory } from "../types/transaction.types";
import {
  expenseQualificationLabels,
  paymentMethodOptions,
  transactionTypeLabels,
} from "../utils/transaction-labels";
import {
  formatAmountForInput,
  formatDateForInput,
} from "../utils/transaction-formatters";

type TransactionFormProps = {
  transaction?: TransactionWithCategory;
  categories: Category[];
  onCancel?: () => void;
  onSuccess?: () => void;
};

function getCompatibleCategories(categories: Category[], type: TransactionType) {
  return categories.filter((category) => {
    if (!category.isActive) {
      return false;
    }

    if (type === "INCOME") {
      return category.type === "INCOME" || category.type === "BOTH";
    }

    return category.type === "EXPENSE" || category.type === "BOTH";
  });
}

function getDefaultValues(): TransactionFormInput {
  return {
    type: "EXPENSE",
    description: "",
    amount: "",
    date: formatDateForInput(new Date()),
    categoryId: "",
    qualification: undefined,
    paymentMethod: undefined,
    notes: undefined,
    isRecurring: false,
  };
}

export function TransactionForm({
  transaction,
  categories,
  onCancel,
  onSuccess,
}: TransactionFormProps) {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isEditing = !!transaction;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<TransactionFormInput>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: getDefaultValues(),
  });

  const selectedType = watch("type");
  const selectedCategoryId = watch("categoryId");

  const compatibleCategories = useMemo(
    () => getCompatibleCategories(categories, selectedType),
    [categories, selectedType],
  );

  useEffect(() => {
    if (transaction) {
      reset({
        type: transaction.type,
        description: transaction.description,
        amount: formatAmountForInput(transaction.amount),
        date: formatDateForInput(transaction.date),
        categoryId: transaction.categoryId,
        qualification: transaction.qualification ?? undefined,
        paymentMethod: transaction.paymentMethod ?? undefined,
        notes: transaction.notes ?? undefined,
        isRecurring: transaction.isRecurring,
      });
      return;
    }

    reset(getDefaultValues());
  }, [transaction, reset]);

  useEffect(() => {
    if (selectedType === "INCOME") {
      setValue("qualification", undefined);
    }
  }, [selectedType, setValue]);

  useEffect(() => {
    if (!selectedCategoryId) {
      return;
    }

    const isCompatible = compatibleCategories.some(
      (category) => category.id === selectedCategoryId,
    );

    if (!isCompatible) {
      setValue("categoryId", "");
    }
  }, [compatibleCategories, selectedCategoryId, setValue]);

  function applyServerErrors(
    fieldErrors?: Record<string, string[]>,
    message?: string,
  ) {
    clearErrors();
    let hasFieldError = false;

    if (fieldErrors) {
      for (const [field, messages] of Object.entries(fieldErrors)) {
        if (messages?.[0]) {
          setError(field as keyof TransactionFormInput, { message: messages[0] });
          hasFieldError = true;
        }
      }
    }

    if (message) {
      setServerMessage(message);
      return;
    }

    setServerMessage(hasFieldError ? null : "Não foi possível salvar a movimentação.");
  }

  function onSubmit(values: TransactionFormInput) {
    setServerMessage(null);
    clearErrors();

    startTransition(async () => {
      const result = isEditing
        ? await updateTransactionAction({ id: transaction.id, ...values })
        : await createTransactionAction(values);

      if (!result.success) {
        applyServerErrors(result.fieldErrors, result.message);
        return;
      }

      if (!isEditing) {
        reset(getDefaultValues());
      }

      onSuccess?.();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="type" className="mb-1 block text-sm font-medium text-slate-700">
            Tipo
          </label>
          <select
            id="type"
            {...register("type")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {(Object.keys(transactionTypeLabels) as TransactionType[]).map((type) => (
              <option key={type} value={type}>
                {transactionTypeLabels[type]}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="date" className="mb-1 block text-sm font-medium text-slate-700">
            Data
          </label>
          <input
            id="date"
            type="date"
            {...register("date")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Descrição
          </label>
          <input
            id="description"
            type="text"
            {...register("description")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Ex.: Supermercado"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="mb-1 block text-sm font-medium text-slate-700">
            Valor
          </label>
          <input
            id="amount"
            type="text"
            inputMode="decimal"
            {...register("amount")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="0,00"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Categoria
          </label>
          {isEditing && transaction && !transaction.category.isActive && (
            <p className="mb-2 text-sm text-amber-700">
              A categoria &quot;{transaction.category.name}&quot; está inativa. Selecione
              uma categoria ativa para salvar.
            </p>
          )}
          <select
            id="categoryId"
            {...register("categoryId")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">Selecione uma categoria</option>
            {compatibleCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>

        {selectedType === "EXPENSE" && (
          <div>
            <label
              htmlFor="qualification"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Qualificação (opcional)
            </label>
            <select
              id="qualification"
              {...register("qualification")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Sem qualificação</option>
              {Object.entries(expenseQualificationLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.qualification && (
              <p className="mt-1 text-sm text-red-600">{errors.qualification.message}</p>
            )}
          </div>
        )}

        <div>
          <label
            htmlFor="paymentMethod"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Forma de pagamento (opcional)
          </label>
          <select
            id="paymentMethod"
            {...register("paymentMethod")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">Não informada</option>
            {paymentMethodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="notes" className="mb-1 block text-sm font-medium text-slate-700">
            Observações (opcional)
          </label>
          <textarea
            id="notes"
            rows={3}
            {...register("notes")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Informações adicionais sobre a movimentação"
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              {...register("isRecurring")}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Movimentação recorrente (marcação informativa)
          </label>
        </div>
      </div>

      {serverMessage && <p className="text-sm text-red-600">{serverMessage}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Salvando..."
            : isEditing
              ? "Salvar alterações"
              : "Criar movimentação"}
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
    </form>
  );
}
