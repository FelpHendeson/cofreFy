"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Category, TransactionType } from "@prisma/client";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  createTransactionAction,
  updateTransactionAction,
} from "../actions/transaction.actions";
import {
  transactionFormSchema,
  type TransactionFormInput,
} from "../schemas/transaction.schema";
import type { SerializedTransactionWithCategory } from "../utils/transaction-serializer";
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
  transaction?: SerializedTransactionWithCategory;
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
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<TransactionFormInput>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: getDefaultValues(),
  });

  const selectedType = useWatch({ control, name: "type" });
  const selectedCategoryId = useWatch({ control, name: "categoryId" });

  const compatibleCategories = useMemo(
    () => getCompatibleCategories(categories, selectedType ?? "EXPENSE"),
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
        <Select id="type" label="Tipo" error={errors.type?.message} {...register("type")}>
          {(Object.keys(transactionTypeLabels) as TransactionType[]).map((type) => (
            <option key={type} value={type}>
              {transactionTypeLabels[type]}
            </option>
          ))}
        </Select>

        <Input
          id="date"
          type="date"
          label="Data"
          error={errors.date?.message}
          {...register("date")}
        />

        <div className="md:col-span-2">
          <Input
            id="description"
            label="Descrição"
            placeholder="Ex.: Supermercado"
            error={errors.description?.message}
            {...register("description")}
          />
        </div>

        <Input
          id="amount"
          type="text"
          inputMode="decimal"
          label="Valor"
          placeholder="0,00"
          error={errors.amount?.message}
          {...register("amount")}
        />

        <Select
          id="categoryId"
          label="Categoria"
          hint={
            isEditing && transaction && !transaction.category.isActive
              ? `A categoria "${transaction.category.name}" está inativa. Selecione uma categoria ativa para salvar.`
              : undefined
          }
          error={errors.categoryId?.message}
          {...register("categoryId")}
        >
          <option value="">Selecione uma categoria</option>
          {compatibleCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>

        {selectedType === "EXPENSE" && (
          <Select
            id="qualification"
            label="Qualificação (opcional)"
            error={errors.qualification?.message}
            {...register("qualification")}
          >
            <option value="">Sem qualificação</option>
            {Object.entries(expenseQualificationLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        )}

        <Select
          id="paymentMethod"
          label="Forma de pagamento (opcional)"
          {...register("paymentMethod")}
        >
          <option value="">Não informada</option>
          {paymentMethodOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <div className="md:col-span-2">
          <Textarea
            id="notes"
            rows={3}
            label="Observações (opcional)"
            placeholder="Informações adicionais sobre a movimentação"
            error={errors.notes?.message}
            {...register("notes")}
          />
        </div>

        <div className="md:col-span-2">
          <label className="inline-flex items-center gap-2.5 text-sm text-slate-700">
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
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Salvando..."
            : isEditing
              ? "Salvar alterações"
              : "Criar movimentação"}
        </Button>

        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
