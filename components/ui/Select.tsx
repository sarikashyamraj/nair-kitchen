import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: string[];
}

export default function Select({
  label,
  error,
  options,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#5A4032]">
          {label}
        </label>
      )}

      <select
        {...props}
        className={`w-full rounded-xl border border-[#EADCC4] bg-white px-4 py-3 text-[#5A4032] shadow-sm transition-all duration-200 focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/20 focus:outline-none ${className}`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option || "Select unit"}
          </option>
        ))}
      </select>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}