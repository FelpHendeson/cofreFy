import { PrismaClient } from "@prisma/client";
import {
  getCategoryId,
  getCategoryMap,
  seedCategories,
} from "./lib/seed-categories.mjs";

const prisma = new PrismaClient();

const SCENARIO_MARKER = "seed:annual-scenario";
const DEFAULT_YEAR = Number(process.env.SEED_SCENARIO_YEAR ?? new Date().getFullYear() - 1);

function scenarioDate(year, month, day) {
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function buildAnnualScenario(year, categoryMap) {
  const transactions = [];

  const salary = (month, amount = 3200) =>
    transactions.push({
      type: "INCOME",
      description: "Salário mensal",
      amount,
      date: scenarioDate(year, month, 5),
      categoryId: getCategoryId(categoryMap, "Salário", "INCOME"),
      paymentMethod: "BANK_TRANSFER",
      notes: `${SCENARIO_MARKER}-${year}`,
      isRecurring: true,
    });

  const expense = ({
    month,
    day,
    description,
    amount,
    categoryName,
    qualification,
    paymentMethod = "PIX",
    isRecurring = false,
  }) =>
    transactions.push({
      type: "EXPENSE",
      description,
      amount,
      date: scenarioDate(year, month, day),
      categoryId: getCategoryId(categoryMap, categoryName, "EXPENSE"),
      qualification,
      paymentMethod,
      notes: `${SCENARIO_MARKER}-${year}`,
      isRecurring,
    });

  for (let month = 1; month <= 12; month += 1) {
    const salaryAmount = month === 12 ? 4500 : 3200;
    salary(month, salaryAmount);

    expense({
      month,
      day: 8,
      description: "Aluguel",
      amount: 1250,
      categoryName: "Moradia",
      qualification: "ESSENTIAL",
      paymentMethod: "BANK_TRANSFER",
      isRecurring: true,
    });

    expense({
      month,
      day: 12,
      description: "Supermercado",
      amount: 420 + (month % 3) * 35,
      categoryName: "Alimentação",
      qualification: "ESSENTIAL",
    });

    expense({
      month,
      day: 15,
      description: "Transporte mensal",
      amount: 220,
      categoryName: "Transporte",
      qualification: "ESSENTIAL",
      paymentMethod: "DEBIT_CARD",
      isRecurring: true,
    });

    expense({
      month,
      day: 18,
      description: "Assinaturas streaming",
      amount: 89.9,
      categoryName: "Assinaturas",
      qualification: "SUPERFLUOUS",
      paymentMethod: "CREDIT_CARD",
      isRecurring: true,
    });

    expense({
      month,
      day: 20,
      description: "Restaurante / lazer",
      amount: 150 + month * 8,
      categoryName: "Lazer",
      qualification: "SUPERFLUOUS",
    });

    if (month % 2 === 0) {
      transactions.push({
        type: "INCOME",
        description: "Freelance pontual",
        amount: 600 + month * 25,
        date: scenarioDate(year, month, 22),
        categoryId: getCategoryId(categoryMap, "Freelance", "INCOME"),
        paymentMethod: "PIX",
        notes: `${SCENARIO_MARKER}-${year}`,
        isRecurring: false,
      });
    }

    if (month % 3 === 0) {
      expense({
        month,
        day: 25,
        description: "Parcela empréstimo",
        amount: 380,
        categoryName: "Dívidas",
        qualification: "DEBT",
        paymentMethod: "BANK_SLIP",
      });
    }

    if (month % 4 === 0) {
      expense({
        month,
        day: 27,
        description: "Consulta médica",
        amount: 250,
        categoryName: "Saúde",
        qualification: "IMPORTANT",
      });
    }

    if (month === 6) {
      expense({
        month,
        day: 14,
        description: "Curso online",
        amount: 499,
        categoryName: "Educação",
        qualification: "INVESTMENT",
        paymentMethod: "CREDIT_CARD",
      });
    }

    if (month === 8) {
      expense({
        month,
        day: 3,
        description: "Reparo emergencial",
        amount: 680,
        categoryName: "Emergência",
        qualification: "EMERGENCY",
      });
    }

    if (month === 11) {
      transactions.push({
        type: "INCOME",
        description: "Reembolso despesas",
        amount: 320,
        date: scenarioDate(year, month, 10),
        categoryId: getCategoryId(categoryMap, "Reembolso", "INCOME"),
        paymentMethod: "PIX",
        notes: `${SCENARIO_MARKER}-${year}`,
        isRecurring: false,
      });
    }

    if (month === 12) {
      expense({
        month,
        day: 28,
        description: "Presentes de fim de ano",
        amount: 450,
        categoryName: "Compras pessoais",
        qualification: "IMPORTANT",
      });

      transactions.push({
        type: "INCOME",
        description: "Décimo terceiro",
        amount: 1300,
        date: scenarioDate(year, month, 20),
        categoryId: getCategoryId(categoryMap, "Salário", "INCOME"),
        paymentMethod: "BANK_TRANSFER",
        notes: `${SCENARIO_MARKER}-${year}`,
        isRecurring: false,
      });
    }
  }

  return transactions;
}

async function clearScenario(year) {
  const deleted = await prisma.transaction.deleteMany({
    where: {
      notes: `${SCENARIO_MARKER}-${year}`,
    },
  });

  return deleted.count;
}

async function main() {
  const year = DEFAULT_YEAR;

  const categoriesCount = await seedCategories(prisma);
  console.log(`Categorias padrão garantidas: ${categoriesCount}.`);

  const removed = await clearScenario(year);
  if (removed > 0) {
    console.log(`Cenário anterior de ${year} removido: ${removed} movimentações.`);
  }

  const categoryMap = await getCategoryMap(prisma);
  const scenarioTransactions = buildAnnualScenario(year, categoryMap);

  for (const transaction of scenarioTransactions) {
    await prisma.transaction.create({ data: transaction });
  }

  const incomeCount = scenarioTransactions.filter((item) => item.type === "INCOME").length;
  const expenseCount = scenarioTransactions.filter((item) => item.type === "EXPENSE").length;

  console.log(
    `Cenário anual ${year} inserido: ${scenarioTransactions.length} movimentações (${incomeCount} entradas, ${expenseCount} saídas).`,
  );
  console.log(`Use SEED_SCENARIO_YEAR=2026 para outro ano. Marca: ${SCENARIO_MARKER}-${year}`);
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed de cenário:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
