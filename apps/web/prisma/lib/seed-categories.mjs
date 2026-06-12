export const defaultCategories = [
  { name: "Salário", type: "INCOME" },
  { name: "Freelance", type: "INCOME" },
  { name: "Reembolso", type: "INCOME" },
  { name: "Venda", type: "INCOME" },
  { name: "Rendimento", type: "INCOME" },
  { name: "Presente", type: "INCOME" },
  { name: "Outros", type: "BOTH" },
  { name: "Moradia", type: "EXPENSE" },
  { name: "Alimentação", type: "EXPENSE" },
  { name: "Transporte", type: "EXPENSE" },
  { name: "Saúde", type: "EXPENSE" },
  { name: "Educação", type: "EXPENSE" },
  { name: "Lazer", type: "EXPENSE" },
  { name: "Dívidas", type: "EXPENSE" },
  { name: "Assinaturas", type: "EXPENSE" },
  { name: "Compras pessoais", type: "EXPENSE" },
  { name: "Investimentos", type: "EXPENSE" },
  { name: "Emergência", type: "EXPENSE" },
];

export async function seedCategories(prisma) {
  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: {
        name_type: {
          name: category.name,
          type: category.type,
        },
      },
      update: {
        isDefault: true,
      },
      create: {
        name: category.name,
        type: category.type,
        isDefault: true,
        isActive: true,
      },
    });
  }

  return defaultCategories.length;
}

export async function getCategoryMap(prisma) {
  const categories = await prisma.category.findMany();
  const map = new Map();

  for (const category of categories) {
    map.set(`${category.name}:${category.type}`, category);
  }

  return map;
}

export function getCategoryId(map, name, type) {
  const category = map.get(`${name}:${type}`);

  if (!category) {
    throw new Error(`Categoria não encontrada: ${name} (${type})`);
  }

  return category.id;
}
