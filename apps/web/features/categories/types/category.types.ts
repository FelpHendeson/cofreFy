import type { Category, CategoryType } from "@prisma/client";

export type { Category, CategoryType };

export type CategoryFilterType = CategoryType | "ALL";

export type CategoryActionResult = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};
