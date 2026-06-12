import { describe, expect, it } from "vitest";
import { transactionFormSchema } from "./transaction.schema";

const baseInput = {
  type: "EXPENSE" as const,
  description: "Mercado",
  amount: "10.50",
  date: "2026-06-11",
  categoryId: "cat-1",
};

describe("transactionFormSchema", () => {
  it("TS003 — bloqueia movimentação sem descrição", () => {
    const result = transactionFormSchema.safeParse({
      ...baseInput,
      description: "",
    });

    expect(result.success).toBe(false);
  });

  it("TS004 — bloqueia valor zero", () => {
    const result = transactionFormSchema.safeParse({
      ...baseInput,
      amount: "0",
    });

    expect(result.success).toBe(false);
  });

  it("TS005 — bloqueia valor negativo", () => {
    const result = transactionFormSchema.safeParse({
      ...baseInput,
      amount: "-10",
    });

    expect(result.success).toBe(false);
  });

  it("TS006 — bloqueia movimentação sem categoria", () => {
    const result = transactionFormSchema.safeParse({
      ...baseInput,
      categoryId: "",
    });

    expect(result.success).toBe(false);
  });

  it("TS007 — bloqueia observação muito longa", () => {
    const result = transactionFormSchema.safeParse({
      ...baseInput,
      notes: "x".repeat(501),
    });

    expect(result.success).toBe(false);
  });

  it("aceita movimentação válida", () => {
    const result = transactionFormSchema.safeParse(baseInput);

    expect(result.success).toBe(true);
  });
});
