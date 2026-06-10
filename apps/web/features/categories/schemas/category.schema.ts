import { z } from "zod";

export const categoryTypeSchema = z.enum(["INCOME", "EXPENSE", "BOTH"]);

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter no mínimo 2 caracteres.")
    .max(80, "O nome deve ter no máximo 80 caracteres."),
  type: categoryTypeSchema,
  color: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  icon: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  isActive: z.boolean().optional(),
});

export const createCategorySchema = categoryFormSchema;

export const updateCategorySchema = categoryFormSchema.extend({
  id: z.string().min(1),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
