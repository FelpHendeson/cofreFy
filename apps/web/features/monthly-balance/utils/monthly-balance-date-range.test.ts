import { describe, expect, it } from "vitest";
import { getMonthlyBalanceDateRange } from "./monthly-balance-date-range";

describe("getMonthlyBalanceDateRange", () => {
  it("TU008 — usa intervalo semiaberto", () => {
    const { start, exclusiveEnd } = getMonthlyBalanceDateRange(3, 2025);

    expect(start).toEqual(new Date(2025, 2, 1, 0, 0, 0, 0));
    expect(exclusiveEnd).toEqual(new Date(2025, 3, 1, 0, 0, 0, 0));
  });
});
