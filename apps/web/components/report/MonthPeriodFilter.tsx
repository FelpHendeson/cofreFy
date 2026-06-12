"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { monthLabels } from "@/features/transactions/utils/transaction-labels";

type MonthPeriod = {
  month: number;
  year: number;
};

type MonthPeriodFilterProps = {
  period: MonthPeriod;
  basePath: string;
  idPrefix: string;
};

export function MonthPeriodFilter({ period, basePath, idPrefix }: MonthPeriodFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, index) => currentYear - 3 + index);

  function updateParam(key: "month" | "year", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:max-w-md">
      <FilterSelect
        id={`${idPrefix}-month-filter`}
        label="Mês"
        value={period.month}
        onChange={(value) => updateParam("month", value)}
        options={monthLabels.map((label, index) => ({
          value: index + 1,
          label,
        }))}
      />

      <FilterSelect
        id={`${idPrefix}-year-filter`}
        label="Ano"
        value={period.year}
        onChange={(value) => updateParam("year", value)}
        options={yearOptions.map((year) => ({
          value: year,
          label: String(year),
        }))}
      />
    </div>
  );
}
