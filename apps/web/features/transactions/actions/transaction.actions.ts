"use server";

import { revalidatePath } from "next/cache";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../schemas/transaction.schema";
import { transactionService } from "../services/transaction.service";
import type { TransactionActionResult } from "../types/transaction.types";

function formatZodErrors(
  fieldErrors: Record<string, string[] | undefined>,
): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(fieldErrors)
      .filter((entry): entry is [string, string[]] => !!entry[1]?.length)
      .map(([key, value]) => [key, value]),
  );
}

export async function createTransactionAction(
  input: unknown,
): Promise<TransactionActionResult> {
  const parsed = createTransactionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: formatZodErrors(parsed.error.flatten().fieldErrors),
    };
  }

  try {
    await transactionService.create(parsed.data);
    revalidatePath("/transactions");
    return { success: true, message: "Movimentação criada com sucesso." };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível criar a movimentação.",
    };
  }
}

export async function updateTransactionAction(
  input: unknown,
): Promise<TransactionActionResult> {
  const parsed = updateTransactionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: formatZodErrors(parsed.error.flatten().fieldErrors),
    };
  }

  try {
    await transactionService.update(parsed.data);
    revalidatePath("/transactions");
    return { success: true, message: "Movimentação atualizada com sucesso." };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a movimentação.",
    };
  }
}

export async function deleteTransactionAction(
  id: string,
): Promise<TransactionActionResult> {
  try {
    await transactionService.delete(id);
    revalidatePath("/transactions");
    return { success: true, message: "Movimentação excluída com sucesso." };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a movimentação.",
    };
  }
}
