import { z } from "zod";

export const transactionTypeSchema = z.enum(["INCOME", "EXPENSE"]);

export const expenseQualificationSchema = z.enum([
  "ESSENTIAL",
  "IMPORTANT",
  "SUPERFLUOUS",
  "INVESTMENT",
  "DEBT",
  "EMERGENCY",
]);

export const paymentMethodSchema = z.enum([
  "PIX",
  "CASH",
  "DEBIT_CARD",
  "CREDIT_CARD",
  "BANK_SLIP",
  "BANK_TRANSFER",
  "OTHER",
]);

const optionalEnumField = <T extends z.ZodTypeAny>(schema: T) =>
  z
    .union([schema, z.literal("")])
    .optional()
    .transform((value) => (value === "" ? undefined : value));

const transactionBaseSchema = z.object({
  type: transactionTypeSchema,
  description: z
    .string()
    .trim()
    .min(2, "A descrição deve ter no mínimo 2 caracteres.")
    .max(120, "A descrição deve ter no máximo 120 caracteres."),
  amount: z
    .string()
    .trim()
    .min(1, "Valor obrigatório.")
    .refine((value) => {
      const normalized = value.replace(",", ".");
      return /^\d+(\.\d{1,2})?$/.test(normalized);
    }, "Informe um valor monetário válido com até duas casas decimais.")
    .refine((value) => {
      const normalized = value.replace(",", ".");
      return parseFloat(normalized) > 0;
    }, "Valor deve ser maior que zero."),
  date: z
    .string()
    .min(1, "Data obrigatória.")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Data inválida."),
  categoryId: z.string().min(1, "Categoria obrigatória."),
  qualification: optionalEnumField(expenseQualificationSchema),
  paymentMethod: optionalEnumField(paymentMethodSchema),
  notes: z
    .string()
    .trim()
    .max(500, "Observações devem ter no máximo 500 caracteres.")
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  isRecurring: z.boolean().optional(),
});

function validateIncomeQualification(
  data: z.infer<typeof transactionBaseSchema>,
  ctx: z.RefinementCtx,
) {
  if (data.type === "INCOME" && data.qualification) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Qualificação não se aplica a entradas.",
      path: ["qualification"],
    });
  }
}

export const transactionFormSchema = transactionBaseSchema.superRefine(
  validateIncomeQualification,
);

export const createTransactionSchema = transactionFormSchema;

export const updateTransactionSchema = transactionBaseSchema
  .extend({
    id: z.string().min(1),
  })
  .superRefine(validateIncomeQualification);

export type TransactionFormInput = z.infer<typeof transactionFormSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
