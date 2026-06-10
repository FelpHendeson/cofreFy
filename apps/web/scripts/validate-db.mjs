import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  await prisma.$queryRaw`SELECT 1`;
  console.log("Conexão com MySQL estabelecida com sucesso.");
} catch (error) {
  console.error("Falha na conexão com o MySQL:", error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
