import type { Decimal } from "@prisma/client/runtime/library";

function toDateValue(date: Date | string): Date {
  return typeof date === "string" ? new Date(date) : date;
}

export function formatAmount(amount: Decimal | number | string): string {
  const numeric =
    typeof amount === "object" && amount !== null && "toNumber" in amount
      ? (amount as Decimal).toNumber()
      : Number(amount);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numeric);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(toDateValue(date));
}

export function formatDateForInput(date: Date | string): string {
  const value = toDateValue(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatAmountForInput(amount: Decimal | number | string): string {
  const numeric =
    typeof amount === "object" && amount !== null && "toNumber" in amount
      ? (amount as Decimal).toNumber()
      : Number(amount);

  return numeric.toFixed(2);
}

export function parseAmountValue(amount: string): string {
  return amount.replace(",", ".");
}

export function parseDateValue(date: string): Date {
  return new Date(`${date}T12:00:00`);
}

export function getMonthDateRange(month: number, year: number) {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
}
