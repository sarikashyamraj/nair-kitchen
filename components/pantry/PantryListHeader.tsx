import {
  ArrowUpDown,
} from "lucide-react";
import {
  PantrySortOption,
} from "../../lib/pantry/pantryFilters";

type PantryListHeaderProps = {
  itemCount: number;
  sortOption: PantrySortOption;
  onSortChange: (
    value: PantrySortOption
  ) => void;
};

const sortOptions: Array<{
  value: PantrySortOption;
  label: string;
}> = [
  {
    value: "attention",
    label: "Attention First",
  },
  {
    value: "name_asc",
    label: "Name (A–Z)",
  },
  {
    value: "name_desc",
    label: "Name (Z–A)",
  },
  {
    value: "quantity_asc",
    label: "Quantity: Low–High",
  },
  {
    value: "quantity_desc",
    label: "Quantity: High–Low",
  },
];

export default function PantryListHeader({
  itemCount,
  sortOption,
  onSortChange,
}: PantryListHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold text-[#245B32] sm:text-xl">
        Items
        <span className="ml-1 font-medium text-gray-500">
          ({itemCount})
        </span>
      </h2>

      <label className="relative flex shrink-0 items-center">
  <ArrowUpDown
    size={14}
    strokeWidth={1.8}
    className="pointer-events-none absolute left-3 text-[#8A8178]"
  />

  <select
    value={sortOption}
    onChange={(event) =>
      onSortChange(
        event.target
          .value as PantrySortOption
      )
    }
    aria-label="Sort inventory items"
    className="min-h-9 max-w-[155px] appearance-none rounded-xl border border-[#E8DED1] bg-[#FAF8F3] py-2 pl-8 pr-7 text-[11px] font-medium text-[#5A4032] outline-none transition hover:bg-[#F8F4EC] focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/10 sm:max-w-none sm:text-xs"
  >
    {sortOptions.map(
      (option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      )
    )}
  </select>

  <span
    aria-hidden="true"
    className="pointer-events-none absolute right-2.5 text-[9px] text-[#8A8178]"
  >
    ▼
  </span>
</label>
    </div>
  );
}