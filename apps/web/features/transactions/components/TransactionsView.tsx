"use client";

import type { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TransactionListFilters } from "../types/transaction.types";
import type { SerializedTransactionWithCategory } from "../utils/transaction-serializer";
import { Button } from "@/components/ui/Button";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionFormModal } from "./TransactionFormModal";
import { TransactionList } from "./TransactionList";

type TransactionsViewProps = {
  transactions: SerializedTransactionWithCategory[];
  categories: Category[];
  filters: TransactionListFilters;
};

type ModalState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; transaction: SerializedTransactionWithCategory };

export function TransactionsView({
  transactions,
  categories,
  filters,
}: TransactionsViewProps) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  function handleSuccess() {
    router.refresh();
  }

  function closeModal() {
    setModal({ mode: "closed" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <TransactionFilters filters={filters} categories={categories} />
        </div>

        <Button
          type="button"
          className="shrink-0"
          onClick={() => setModal({ mode: "create" })}
        >
          Nova movimentação
        </Button>
      </div>

      <TransactionList
        transactions={transactions}
        onEdit={(transaction) => setModal({ mode: "edit", transaction })}
      />

      <TransactionFormModal
        open={modal.mode !== "closed"}
        transaction={modal.mode === "edit" ? modal.transaction : undefined}
        categories={categories}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
