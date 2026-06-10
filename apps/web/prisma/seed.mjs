import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
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

async function main() {
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

  console.log(`Seed concluído: ${defaultCategories.length} categorias padrão processadas.`);
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
