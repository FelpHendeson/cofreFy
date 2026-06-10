"use server";

import { revalidatePath } from "next/cache";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema";
import { categoryService } from "../services/category.service";
import type { CategoryActionResult } from "../types/category.types";

function formatZodErrors(
  fieldErrors: Record<string, string[] | undefined>,
): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(fieldErrors)
      .filter((entry): entry is [string, string[]] => !!entry[1]?.length)
      .map(([key, value]) => [key, value]),
  );
}

export async function createCategoryAction(
  input: unknown,
): Promise<CategoryActionResult> {
  const parsed = createCategorySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: formatZodErrors(parsed.error.flatten().fieldErrors),
    };
  }

  try {
    await categoryService.create(parsed.data);
    revalidatePath("/categories");
    return { success: true, message: "Categoria criada com sucesso." };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível criar a categoria.",
    };
  }
}

export async function updateCategoryAction(
  input: unknown,
): Promise<CategoryActionResult> {
  const parsed = updateCategorySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: formatZodErrors(parsed.error.flatten().fieldErrors),
    };
  }

  try {
    await categoryService.update(parsed.data);
    revalidatePath("/categories");
    return { success: true, message: "Categoria atualizada com sucesso." };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a categoria.",
    };
  }
}

export async function deactivateCategoryAction(
  id: string,
): Promise<CategoryActionResult> {
  try {
    await categoryService.deactivate(id);
    revalidatePath("/categories");
    return { success: true, message: "Categoria inativada com sucesso." };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível inativar a categoria.",
    };
  }
}

export async function reactivateCategoryAction(
  id: string,
): Promise<CategoryActionResult> {
  try {
    await categoryService.reactivate(id);
    revalidatePath("/categories");
    return { success: true, message: "Categoria reativada com sucesso." };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível reativar a categoria.",
    };
  }
}

export async function deleteCategoryAction(
  id: string,
): Promise<CategoryActionResult> {
  try {
    await categoryService.delete(id);
    revalidatePath("/categories");
    return { success: true, message: "Categoria excluída com sucesso." };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a categoria.",
    };
  }
}
