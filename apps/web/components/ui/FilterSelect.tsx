"use client";

import { Select } from "./Select";

type FilterSelectOption = {
  value: string | number;
  label: string;
};

type FilterSelectProps = {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: FilterSelectOption[];
  className?: string;
};

export function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
  className,
}: FilterSelectProps) {
  return (
    <Select
      id={id}
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={className}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}
