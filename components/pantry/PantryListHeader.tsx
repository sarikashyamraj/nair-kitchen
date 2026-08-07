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
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold text-[#245B32] sm:text-xl">
        Items
        <span className="ml-1 font-medium text-gray-500">
          ({itemCount})
        </span>
      </h2>

      <label className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
        <span className="hidden sm:inline">
          Sort:
        </span>

        <select
          value={sortOption}
          onChange={(event) =>
            onSortChange(
              event.target
                .value as PantrySortOption
            )
          }
          aria-label="Sort inventory items"
          className="max-w-[150px] rounded-lg border border-[#EADCC4] bg-white px-2 py-2 text-xs font-medium text-[#5A4032] outline-none focus:border-[#2F6B3C] sm:max-w-none sm:text-sm"
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
      </label>
    </div>
  );
}