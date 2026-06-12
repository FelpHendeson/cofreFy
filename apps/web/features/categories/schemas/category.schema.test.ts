import { describe, expect, it } from "vitest";
import { categoryFormSchema } from "./category.schema";

describe("categoryFormSchema", () => {
  it("TS001 — bloqueia categoria sem nome", () => {
    const result = categoryFormSchema.safeParse({
      name: "",
      type: "EXPENSE",
    });

    expect(result.success).toBe(false);
  });

  it("TS002 — bloqueia categoria sem tipo", () => {
    const result = categoryFormSchema.safeParse({
      name: "Moradia",
    });

    expect(result.success).toBe(false);
  });

  it("aceita categoria válida", () => {
    const result = categoryFormSchema.safeParse({
      name: "Moradia",
      type: "EXPENSE",
    });

    expect(result.success).toBe(true);
  });
});
