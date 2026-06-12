export function getYearFilterOptions(span = 7): number[] {
  const currentYear = new Date().getFullYear();
  const offset = Math.floor(span / 2);

  return Array.from({ length: span }, (_, index) => currentYear - offset + index);
}
