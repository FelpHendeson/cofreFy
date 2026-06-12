import { describe, expect, it } from "vitest";
import {
  createCategoryFixture,
  createTransactionFixture,
} from "@/features/test-utils/transaction.fixtures";
import { buildMonthlyBalanceData } from "./monthly-balance-calculations";

const period = { month: 6, year: 2026 };

describe("buildMonthlyBalanceData", () => {
  it("calcula totais, saldo e quantidades", () => {
    const data = buildMonthlyBalanceData(
      [
        createTransactionFixture({
          id: "credit-1",
          type: "INCOME",
          amount: 2500,
          category: createCategoryFixture({ id: "cat-salary", name: "Salário", type: "INCOME" }),
        }),
        createTransactionFixture({
          id: "credit-2",
          type: "INCOME",
          amount: 500,
          category: createCategoryFixture({ id: "cat-freelance", name: "Freelance", type: "INCOME" }),
        }),
        createTransactionFixture({ id: "debit-1", amount: 700, paymentMethod: "PIX" }),
        createTransactionFixture({ id: "debit-2", amount: 350, paymentMethod: "DEBIT_CARD" }),
      ],
      period,
    );

    expect(data.summary.totalCredits).toBe("3000.00");
    expect(data.summary.totalDebits).toBe("1050.00");
    expect(data.summary.finalBalance).toBe("1950.00");
    expect(data.summary.situation).toBe("POSITIVE");
    expect(data.summary.creditsCount).toBe(2);
    expect(data.summary.debitsCount).toBe(2);
    expect(data.summary.totalMovementsCount).toBe(4);
  });

  it("TU007 — agrupa movimentações por forma de pagamento", () => {
    const data = buildMonthlyBalanceData(
      [
        createTransactionFixture({ id: "debit-1", amount: 100, paymentMethod: "PIX" }),
        createTransactionFixture({ id: "debit-2", amount: 50, paymentMethod: null }),
      ],
      period,
    );

    expect(data.byPaymentMethod).toHaveLength(2);
    expect(
      data.byPaymentMethod.find((item) => item.paymentMethodLabel === "Não informado")?.total,
    ).toBe("50.00");
  });

  it("separa créditos e débitos e agrupa por categoria", () => {
    const data = buildMonthlyBalanceData(
      [
        createTransactionFixture({
          id: "credit-1",
          type: "INCOME",
          amount: 1000,
          category: createCategoryFixture({ id: "cat-income", name: "Salário", type: "INCOME" }),
        }),
        createTransactionFixture({
          id: "debit-1",
          amount: 200,
          category: createCategoryFixture({ id: "cat-expense", name: "Moradia" }),
        }),
      ],
      period,
    );

    expect(data.credits).toHaveLength(1);
    expect(data.debits).toHaveLength(1);
    expect(data.incomesByCategory[0].categoryName).toBe("Salário");
    expect(data.expensesByCategory[0].categoryName).toBe("Moradia");
  });

  it("retorna estado neutro sem movimentações", () => {
    const data = buildMonthlyBalanceData([], period);

    expect(data.summary.hasMovements).toBe(false);
    expect(data.summary.situation).toBe("NEUTRAL");
    expect(data.summary.totalMovementsCount).toBe(0);
  });
});
