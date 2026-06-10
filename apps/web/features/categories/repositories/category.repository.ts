import type { Category, CategoryType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CategoryFilterType } from "../types/category.types";

function buildTypeFilter(
  type?: CategoryFilterType,
): Prisma.CategoryWhereInput | undefined {
  if (!type || type === "ALL") {
    return undefined;
  }

  return { type };
}

export const categoryRepository = {
  async findAll(type?: CategoryFilterType): Promise<Category[]> {
    return prisma.category.findMany({
      where: buildTypeFilter(type),
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
    });
  },

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  },

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({ data });
  },

  async update(
    id: string,
    data: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    return prisma.category.update({ where: { id }, data });
  },

  async updateStatus(id: string, isActive: boolean): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: { isActive },
    });
  },

  async delete(id: string): Promise<Category> {
    return prisma.category.delete({ where: { id } });
  },

  async existsByNameAndType(
    name: string,
    type: CategoryType,
    excludeId?: string,
  ): Promise<boolean> {
    const category = await prisma.category.findUnique({
      where: {
        name_type: { name, type },
      },
    });

    if (!category) {
      return false;
    }

    return excludeId ? category.id !== excludeId : true;
  },
};
