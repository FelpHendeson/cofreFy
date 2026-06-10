import type { Category } from "@prisma/client";

export type CategoryDeleteCheck = {
  canDelete: boolean;
  reason?: string;
};

/**
 * Verifica se uma categoria pode ser excluída fisicamente (RN007/RN008).
 * A verificação de movimentações será implementada quando o módulo de
 * movimentações existir e o relacionamento Category ↔ Transaction for criado.
 */
export async function canDeleteCategory(
  category: Category,
): Promise<CategoryDeleteCheck> {
  if (category.isDefault) {
    return {
      canDelete: false,
      reason: "Categoria padrão não pode ser excluída.",
    };
  }

  const hasTransactions = await categoryHasTransactions(category.id);

  if (hasTransactions) {
    return {
      canDelete: false,
      reason: "Categoria em uso não pode ser excluída.",
    };
  }

  return { canDelete: true };
}

async function categoryHasTransactions(_categoryId: string): Promise<boolean> {
  // TODO: implementar quando o modelo Transaction existir no Prisma.
  return false;
}
