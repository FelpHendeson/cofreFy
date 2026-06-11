import { CategoriesView } from "@/features/categories/components/CategoriesView";
import { categoryService } from "@/features/categories/services/category.service";
import type { CategoryFilterType } from "@/features/categories/types/category.types";
import { categoryTypeSchema } from "@/features/categories/schemas/category.schema";

type CategoriesPageProps = {
  searchParams: Promise<{ type?: string }>;
};

function parseFilterType(type?: string): CategoryFilterType {
  if (!type) {
    return "ALL";
  }

  const parsed = categoryTypeSchema.safeParse(type);
  return parsed.success ? parsed.data : "ALL";
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const params = await searchParams;
  const filterType = parseFilterType(params.type);
  const categories = await categoryService.list(filterType);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wider text-emerald-600">
          CofreFy
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Categorias</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Gerencie as categorias usadas para classificar entradas e saídas financeiras.
        </p>
      </div>

      <CategoriesView categories={categories} filterType={filterType} />
    </div>
  );
}
