import { ReportSection } from "@/components/report/ReportSection";
import { ReportTable, type ReportColumn } from "@/components/report/ReportTable";
import { formatDate } from "@/features/transactions/utils/transaction-formatters";
import type {
  CategoryBalanceItem,
  CreditItem,
  DebitItem,
  MonthlyBalanceData,
  PaymentMethodBalanceItem,
  QualificationBalanceItem,
} from "../types/monthly-balance.types";
import {
  formatBalanceAmount,
  formatBalancePercentage,
} from "../utils/monthly-balance-formatters";
import { MonthlyBalanceSummary } from "./MonthlyBalanceSummary";

const creditColumns: ReportColumn<CreditItem>[] = [
  {
    key: "date",
    header: "Data",
    cell: (row) => formatDate(row.date),
    cellClassName: "text-slate-600",
  },
  {
    key: "description",
    header: "Descrição",
    cell: (row) => row.description,
    cellClassName: "text-slate-900",
  },
  {
    key: "category",
    header: "Categoria",
    cell: (row) => row.categoryName,
    cellClassName: "text-slate-600",
  },
  {
    key: "payment",
    header: "Pagamento",
    cell: (row) => row.paymentMethodLabel ?? "—",
    cellClassName: "text-slate-600",
  },
  {
    key: "notes",
    header: "Observações",
    cell: (row) => row.notes ?? "—",
    cellClassName: "text-slate-500",
  },
  {
    key: "amount",
    header: "Valor",
    align: "right",
    cell: (row) => formatBalanceAmount(row.amount),
    cellClassName: "text-emerald-700",
  },
];

const debitColumns: ReportColumn<DebitItem>[] = [
  {
    key: "date",
    header: "Data",
    cell: (row) => formatDate(row.date),
    cellClassName: "text-slate-600",
  },
  {
    key: "description",
    header: "Descrição",
    cell: (row) => row.description,
    cellClassName: "text-slate-900",
  },
  {
    key: "category",
    header: "Categoria",
    cell: (row) => row.categoryName,
    cellClassName: "text-slate-600",
  },
  {
    key: "qualification",
    header: "Qualificação",
    cell: (row) => row.qualificationLabel ?? "—",
    cellClassName: "text-slate-600",
  },
  {
    key: "payment",
    header: "Pagamento",
    cell: (row) => row.paymentMethodLabel ?? "—",
    cellClassName: "text-slate-600",
  },
  {
    key: "notes",
    header: "Observações",
    cell: (row) => row.notes ?? "—",
    cellClassName: "text-slate-500",
  },
  {
    key: "amount",
    header: "Valor",
    align: "right",
    cell: (row) => formatBalanceAmount(row.amount),
    cellClassName: "text-red-700",
  },
];

function categoryColumns(): ReportColumn<CategoryBalanceItem>[] {
  return [
    {
      key: "category",
      header: "Categoria",
      cell: (row) => row.categoryName,
      cellClassName: "text-slate-900",
    },
    {
      key: "count",
      header: "Quantidade",
      align: "right",
      cell: (row) => row.count,
      cellClassName: "text-slate-700",
    },
    {
      key: "total",
      header: "Total",
      align: "right",
      cell: (row) => formatBalanceAmount(row.total),
      cellClassName: "text-slate-700",
    },
    {
      key: "percentage",
      header: "Percentual",
      align: "right",
      cell: (row) => formatBalancePercentage(row.percentage),
      cellClassName: "text-slate-700",
    },
  ];
}

const paymentMethodColumns: ReportColumn<PaymentMethodBalanceItem>[] = [
  {
    key: "label",
    header: "Forma de pagamento",
    cell: (row) => row.paymentMethodLabel,
    cellClassName: "text-slate-900",
  },
  {
    key: "count",
    header: "Quantidade",
    align: "right",
    cell: (row) => row.count,
    cellClassName: "text-slate-700",
  },
  {
    key: "total",
    header: "Total",
    align: "right",
    cell: (row) => formatBalanceAmount(row.total),
    cellClassName: "text-slate-700",
  },
];

const qualificationColumns: ReportColumn<QualificationBalanceItem>[] = [
  {
    key: "label",
    header: "Qualificação",
    cell: (row) => row.qualificationLabel,
    cellClassName: "text-slate-900",
  },
  {
    key: "count",
    header: "Quantidade",
    align: "right",
    cell: (row) => row.count,
    cellClassName: "text-slate-700",
  },
  {
    key: "total",
    header: "Total",
    align: "right",
    cell: (row) => formatBalanceAmount(row.total),
    cellClassName: "text-slate-700",
  },
  {
    key: "percentage",
    header: "Percentual",
    align: "right",
    cell: (row) => formatBalancePercentage(row.percentage),
    cellClassName: "text-slate-700",
  },
];

type MonthlyBalanceContentProps = {
  data: MonthlyBalanceData;
};

export function MonthlyBalanceContent({ data }: MonthlyBalanceContentProps) {
  return (
    <div className="space-y-6">
      <MonthlyBalanceSummary summary={data.summary} />

      <ReportSection
        title="Créditos"
        borderClassName="border-emerald-200/60"
        titleClassName="text-emerald-800"
        isEmpty={data.credits.length === 0}
        emptyMessage="Nenhum crédito registrado neste mês."
      >
        <ReportTable columns={creditColumns} rows={data.credits} getRowKey={(row) => row.id} />
      </ReportSection>

      <ReportSection
        title="Débitos"
        borderClassName="border-red-200/60"
        titleClassName="text-red-800"
        isEmpty={data.debits.length === 0}
        emptyMessage="Nenhum débito registrado neste mês."
      >
        <ReportTable columns={debitColumns} rows={data.debits} getRowKey={(row) => row.id} />
      </ReportSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <ReportSection
          title="Entradas por categoria"
          isEmpty={data.incomesByCategory.length === 0}
          emptyMessage="Nenhuma entrada registrada neste mês."
        >
          <ReportTable
            columns={categoryColumns()}
            rows={data.incomesByCategory}
            getRowKey={(row) => `${row.type}-${row.categoryId}`}
          />
        </ReportSection>

        <ReportSection
          title="Saídas por categoria"
          isEmpty={data.expensesByCategory.length === 0}
          emptyMessage="Nenhuma saída registrada neste mês."
        >
          <ReportTable
            columns={categoryColumns()}
            rows={data.expensesByCategory}
            getRowKey={(row) => `${row.type}-${row.categoryId}`}
          />
        </ReportSection>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ReportSection
          title="Por forma de pagamento"
          isEmpty={data.byPaymentMethod.length === 0}
          emptyMessage="Nenhuma movimentação registrada neste mês."
        >
          <ReportTable
            columns={paymentMethodColumns}
            rows={data.byPaymentMethod}
            getRowKey={(row) => row.paymentMethodKey}
          />
        </ReportSection>

        <ReportSection
          title="Débitos por qualificação"
          isEmpty={data.debitsByQualification.length === 0}
          emptyMessage="Nenhum débito registrado neste mês."
        >
          <ReportTable
            columns={qualificationColumns}
            rows={data.debitsByQualification}
            getRowKey={(row) => row.qualificationKey}
          />
        </ReportSection>
      </div>
    </div>
  );
}
