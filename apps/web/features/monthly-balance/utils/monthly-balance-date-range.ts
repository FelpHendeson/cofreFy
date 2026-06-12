export function getMonthlyBalanceDateRange(month: number, year: number) {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const exclusiveEnd = new Date(year, month, 1, 0, 0, 0, 0);

  return { start, exclusiveEnd };
}
