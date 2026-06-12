import { PrismaClient } from "@prisma/client";
import { seedCategories } from "./lib/seed-categories.mjs";

const prisma = new PrismaClient();

async function main() {
  const count = await seedCategories(prisma);
  console.log(`Seed concluído: ${count} categorias padrão processadas.`);
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
