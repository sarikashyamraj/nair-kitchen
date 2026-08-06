"use client";

import {
  Grid2X2,
  Search,
} from "lucide-react";

type MobileSearchBarProps = {
  searchValue: string;
  onSearchChange: (
    value: string
  ) => void;
  categoryValue?: string;
  categories?: string[];
  onCategoryChange?: (
    value: string
  ) => void;
  placeholder?: string;
};

export default function MobileSearchBar({
  searchValue,
  onSearchChange,
  categoryValue,
  categories = [],
  onCategoryChange,
  placeholder = "Search...",
}: MobileSearchBarProps) {
  return (
    <section className="mb-4 rounded-2xl border border-[#EADCC4] bg-white p-3 shadow-sm md:hidden">
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          type="text"
          value={searchValue}
          onChange={(event) =>
            onSearchChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          className="w-full rounded-xl border border-[#EADCC4] bg-white py-3 pl-10 pr-4 text-sm text-[#5A4032] outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/15"
        />
      </div>

      {categories.length > 0 &&
        onCategoryChange && (
          <div className="mt-3 flex items-center gap-3 border-t border-[#F4E8D0] pt-3">
            <Grid2X2
              size={18}
              className="shrink-0 text-[#2F6B3C]"
            />

            <label
              htmlFor="pantry-category"
              className="text-sm font-semibold text-[#5A4032]"
            >
              Category
            </label>

            <select
              id="pantry-category"
              value={categoryValue}
              onChange={(event) =>
                onCategoryChange(
                  event.target.value
                )
              }
              className="ml-auto min-w-0 flex-1 appearance-none bg-transparent text-right text-sm font-medium text-[#5A4032] outline-none"
            >
              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category === "All"
                      ? "All Categories"
                      : category}
                  </option>
                )
              )}
            </select>
          </div>
        )}
    </section>
  );
}