import { describe, expect, it } from "vitest";
import {
  createCategoryFixture,
  createTransactionFixture,
} from "@/features/test-utils/transaction.fixtures";
import { buildDashboardData } from "./dashboard-calculations";

const period = { month: 6, year: 2026 };

describe("buildDashboardData", () => {
  it("TU001 — calcula saldo positivo", () => {
    const data = buildDashboardData(
      [
        createTransactionFixture({
          id: "income-1",
          type: "INCOME",
          amount: 3000,
          category: createCategoryFixture({ id: "cat-income", name: "Salário", type: "INCOME" }),
        }),
        createTransactionFixture({ id: "expense-1", amount: 1275 }),
      ],
      period,
    );

    expect(data.summary.balance).toBe("1725.00");
    expect(data.summary.situation).toBe("POSITIVE");
    expect(data.summary.savingsPercentage).toBeCloseTo(57.5, 1);
  });

  it("TU002 — calcula saldo negativo", () => {
    const data = buildDashboardData(
      [
        createTransactionFixture({
          id: "income-1",
          type: "INCOME",
          amount: 500,
          category: createCategoryFixture({ id: "cat-income", name: "Salário", type: "INCOME" }),
        }),
        createTransactionFixture({ id: "expense-1", amount: 800 }),
      ],
      period,
    );

    expect(data.summary.balance).toBe("-300.00");
    expect(data.summary.situation).toBe("NEGATIVE");
    expect(data.summary.savingsPercentage).toBe(0);
  });

  it("TU003 — calcula saldo neutro", () => {
    const data = buildDashboardData(
      [
        createTransactionFixture({
          id: "income-1",
          type: "INCOME",
          amount: 1000,
          category: createCategoryFixture({ id: "cat-income", name: "Salário", type: "INCOME" }),
        }),
        createTransactionFixture({ id: "expense-1", amount: 1000 }),
      ],
      period,
    );

    expect(data.summary.balance).toBe("0.00");
    expect(data.summary.situation).toBe("NEUTRAL");
  });

  it("TU004 — evita divisão por zero nos percentuais", () => {
    const data = buildDashboardData([createTransactionFixture({ amount: 200 })], period);

    expect(data.summary.expensePercentage).toBe(0);
    expect(data.summary.savingsPercentage).toBe(0);
  });

  it("TU005 — agrupa saídas por categoria", () => {
    const data = buildDashboardData(
      [
        createTransactionFixture({
          id: "expense-1",
          amount: 400,
          category: createCategoryFixture({ id: "cat-food", name: "Alimentação" }),
        }),
        createTransactionFixture({
          id: "expense-2",
          amount: 100,
          category: createCategoryFixture({ id: "cat-food", name: "Alimentação" }),
        }),
        createTransactionFixture({
          id: "expense-3",
          amount: 200,
          category: createCategoryFixture({ id: "cat-home", name: "Moradia" }),
        }),
      ],
      period,
    );

    expect(data.expensesByCategory).toHaveLength(2);
    expect(data.expensesByCategory[0].categoryName).toBe("Alimentação");
    expect(data.expensesByCategory[0].total).toBe("500.00");
    expect(data.expensesByCategory[0].percentage).toBeCloseTo(71.4, 1);
  });

  it("TU006 — agrupa saídas por qualificação incluindo não qualificado", () => {
    const data = buildDashboardData(
      [
        createTransactionFixture({
          id: "expense-1",
          amount: 300,
          qualification: "ESSENTIAL",
        }),
        createTransactionFixture({
          id: "expense-2",
          amount: 50,
          qualification: null,
        }),
      ],
      period,
    );

    expect(data.expensesByQualification).toHaveLength(2);
    expect(
      data.expensesByQualification.find((item) => item.qualificationLabel === "Não qualificado")
        ?.total,
    ).toBe("50.00");
  });
});
