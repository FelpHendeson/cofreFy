import type { ExpenseQualification, PaymentMethod, TransactionType } from "@prisma/client";
import type {
  TransactionFilterType,
  TransactionQualificationFilter,
} from "../types/transaction.types";

export const transactionTypeLabels: Record<TransactionType, string> = {
  INCOME: "Entrada",
  EXPENSE: "Saída",
};

export const transactionTypeFilterOptions: {
  value: TransactionFilterType;
  label: string;
}[] = [
  { value: "ALL", label: "Todas" },
  { value: "INCOME", label: "Entradas" },
  { value: "EXPENSE", label: "Saídas" },
];

export const expenseQualificationLabels: Record<ExpenseQualification, string> = {
  ESSENTIAL: "Essencial",
  IMPORTANT: "Importante",
  SUPERFLUOUS: "Supérfluo",
  INVESTMENT: "Investimento",
  DEBT: "Dívida",
  EMERGENCY: "Emergência",
};

export const qualificationFilterOptions: {
  value: TransactionQualificationFilter;
  label: string;
}[] = [
  { value: "ALL", label: "Todas" },
  ...Object.entries(expenseQualificationLabels).map(([value, label]) => ({
    value: value as ExpenseQualification,
    label,
  })),
];

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  PIX: "Pix",
  CASH: "Dinheiro",
  DEBIT_CARD: "Cartão de débito",
  CREDIT_CARD: "Cartão de crédito",
  BANK_SLIP: "Boleto",
  BANK_TRANSFER: "Transferência",
  OTHER: "Outro",
};

export const paymentMethodOptions = Object.entries(paymentMethodLabels).map(
  ([value, label]) => ({
    value: value as PaymentMethod,
    label,
  }),
);

export const monthLabels = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
