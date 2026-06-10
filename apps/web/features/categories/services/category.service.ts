import { Prisma } from "@prisma/client";
import { categoryRepository } from "../repositories/category.repository";
import { canDeleteCategory } from "../utils/category-usage.guard";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../schemas/category.schema";
import type { CategoryFilterType } from "../types/category.types";

function isDuplicateError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export const categoryService = {
  async list(type?: CategoryFilterType) {
    return categoryRepository.findAll(type);
  },

  async create(input: CreateCategoryInput) {
    const duplicate = await categoryRepository.existsByNameAndType(
      input.name,
      input.type,
    );

    if (duplicate) {
      throw new Error("Já existe uma categoria com este nome e tipo.");
    }

    try {
      return await categoryRepository.create({
        name: input.name,
        type: input.type,
        color: input.color,
        icon: input.icon,
        isDefault: false,
        isActive: true,
      });
    } catch (error) {
      if (isDuplicateError(error)) {
        throw new Error("Já existe uma categoria com este nome e tipo.");
      }

      throw error;
    }
  },

  async update(input: UpdateCategoryInput) {
    const existing = await categoryRepository.findById(input.id);

    if (!existing) {
      throw new Error("Categoria não encontrada.");
    }

    const duplicate = await categoryRepository.existsByNameAndType(
      input.name,
      input.type,
      input.id,
    );

    if (duplicate) {
      throw new Error("Já existe uma categoria com este nome e tipo.");
    }

    try {
      return await categoryRepository.update(input.id, {
        name: input.name,
        type: input.type,
        color: input.color,
        icon: input.icon,
        isActive: input.isActive ?? existing.isActive,
      });
    } catch (error) {
      if (isDuplicateError(error)) {
        throw new Error("Já existe uma categoria com este nome e tipo.");
      }

      throw error;
    }
  },

  async deactivate(id: string) {
    const existing = await categoryRepository.findById(id);

    if (!existing) {
      throw new Error("Categoria não encontrada.");
    }

    return categoryRepository.updateStatus(id, false);
  },

  async reactivate(id: string) {
    const existing = await categoryRepository.findById(id);

    if (!existing) {
      throw new Error("Categoria não encontrada.");
    }

    return categoryRepository.updateStatus(id, true);
  },

  async delete(id: string) {
    const existing = await categoryRepository.findById(id);

    if (!existing) {
      throw new Error("Categoria não encontrada.");
    }

    const deleteCheck = await canDeleteCategory(existing);

    if (!deleteCheck.canDelete) {
      throw new Error(deleteCheck.reason ?? "Categoria não pode ser excluída.");
    }

    return categoryRepository.delete(id);
  },
};
