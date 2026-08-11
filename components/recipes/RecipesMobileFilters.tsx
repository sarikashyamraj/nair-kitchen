"use client";

import {
  ChefHat,
  LayoutGrid,
  Plus,
  Search,
} from "lucide-react";

import KBDropdown from "../ui/KBDropdown";

type RecipesMobileFiltersProps = {
  searchValue: string;

  onSearchChange: (
    value: string
  ) => void;

  categoryValue: string;

  categories: string[];

  onCategoryChange: (
    value: string
  ) => void;

  mealValue: string;

  mealTypes: string[];

  onMealChange: (
    value: string
  ) => void;

  onAdd: () => void;
};

export default function RecipesMobileFilters({
  searchValue,
  onSearchChange,
  categoryValue,
  categories,
  onCategoryChange,
  mealValue,
  mealTypes,
  onMealChange,
  onAdd,
}: RecipesMobileFiltersProps) {
  const categoryOptions =
    categories.map(
      (category) => ({
        value: category,

        label:
          category === "All"
            ? "All Categories"
            : category,
      })
    );

  const mealOptions =
    mealTypes.map(
      (mealType) => ({
        value: mealType,

        label:
          mealType === "All"
            ? "All Meals"
            : mealType,
      })
    );

  return (
    <section className="rounded-2xl border border-[#EADCC4] bg-white p-2 shadow-sm md:hidden">
      {/* Search + Add Recipe */}
<div className="flex items-center gap-2">
  {/* Search */}
  <div className="relative min-w-0 flex-1">
    <Search
      size={16}
      strokeWidth={1.8}
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <input
      type="search"
      value={searchValue}
      onChange={(event) =>
        onSearchChange(
          event.target.value
        )
      }
      placeholder="Search recipes..."
      className="w-full rounded-xl border border-[#EADCC4] bg-white py-2.5 pl-9 pr-2 text-sm text-[#5A4032] outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/15"
    />
  </div>

  {/* Add Recipe */}
  <button
    type="button"
    onClick={onAdd}
    aria-label="Add recipe"
    className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#2F6B3C] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#245B32] active:scale-[0.98]"
  >
    <Plus
      size={16}
      strokeWidth={2}
    />

    <span className="whitespace-nowrap">
      Add Recipe
    </span>
  </button>
</div>

      {/* Category + Meal */}
      <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#F4E8D0] pt-2">
        {/* Category */}
        <div className="flex min-w-0 items-center gap-1.5">
          <div
  aria-hidden="true"
  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF7F0] text-[#2F6B3C]"
>
  <LayoutGrid
    size={16}
    strokeWidth={2}
  />
</div>

          <div className="min-w-0 flex-1">
            <KBDropdown
              value={categoryValue}
              options={
                categoryOptions
              }
              onChange={
                onCategoryChange
              }
              placeholder="Category"
            />
          </div>
        </div>

        {/* Meal Type */}
        <div className="flex min-w-0 items-center gap-1.5">
          <div
  aria-hidden="true"
  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF4D8] text-[#B87516]"
>
  <ChefHat
    size={17}
    strokeWidth={2}
  />
</div>

          <div className="min-w-0 flex-1">
            <KBDropdown
              value={mealValue}
              options={
                mealOptions
              }
              onChange={
                onMealChange
              }
              placeholder="Meal"
            />
          </div>
        </div>
      </div>
    </section>
  );
}