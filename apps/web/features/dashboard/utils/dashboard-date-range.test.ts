import { describe, expect, it } from "vitest";
import { getDashboardMonthDateRange } from "./dashboard-date-range";

describe("getDashboardMonthDateRange", () => {
  it("TU008 — retorna início do mês e início do próximo mês", () => {
    const { start, exclusiveEnd } = getDashboardMonthDateRange(6, 2026);

    expect(start).toEqual(new Date(2026, 5, 1, 0, 0, 0, 0));
    expect(exclusiveEnd).toEqual(new Date(2026, 6, 1, 0, 0, 0, 0));
  });

  it("avança o ano em dezembro", () => {
    const { start, exclusiveEnd } = getDashboardMonthDateRange(12, 2026);

    expect(start).toEqual(new Date(2026, 11, 1, 0, 0, 0, 0));
    expect(exclusiveEnd).toEqual(new Date(2027, 0, 1, 0, 0, 0, 0));
  });
});
