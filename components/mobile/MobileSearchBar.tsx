"use client";

import {
  Grid2X2,
  Search,
} from "lucide-react";

import KBDropdown from "../ui/KBDropdown";

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

  compact?: boolean;
};

export default function MobileSearchBar({
  searchValue,
  onSearchChange,
  categoryValue,
  categories = [],
  onCategoryChange,
  placeholder = "Search...",
  compact = false,
}: MobileSearchBarProps) {
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

  const showCategory =
    categories.length > 0 &&
    onCategoryChange &&
    categoryValue !==
      undefined;

  /*
   * Standard mode remains available
   * for other screens.
   *
   * Grocery List uses compact mode
   * to reduce unnecessary vertical
   * space on mobile.
   */
  if (compact) {
    return (
      <section className="rounded-2xl border border-[#EADCC4] bg-white p-2 shadow-sm md:hidden">
        {/* Search */}
        <div className="relative">
          <Search
            size={17}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={
              searchValue
            }
            onChange={(
              event
            ) =>
              onSearchChange(
                event.target.value
              )
            }
            placeholder={
              placeholder
            }
            className="w-full rounded-xl border border-[#EADCC4] bg-white py-2.5 pl-9 pr-3 text-sm text-[#5A4032] outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/15"
          />
        </div>

        {/* Compact Category */}
        {showCategory && (
          <div className="mt-2 flex items-center gap-2 border-t border-[#F4E8D0] pt-2">
            <div
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF7F0] text-[#2F6B3C]"
            >
              <Grid2X2
                size={16}
                strokeWidth={
                  1.9
                }
              />
            </div>

            <div className="min-w-0 flex-1">
              <KBDropdown
                value={
                  categoryValue
                }
                options={
                  categoryOptions
                }
                onChange={
                  onCategoryChange
                }
                placeholder="All Categories"
              />
            </div>
          </div>
        )}
      </section>
    );
  }

  /*
   * Standard layout
   */
  return (
    <section className="mb-4 rounded-2xl border border-[#EADCC4] bg-white p-3 shadow-sm md:hidden">
      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          type="search"
          value={
            searchValue
          }
          onChange={(
            event
          ) =>
            onSearchChange(
              event.target.value
            )
          }
          placeholder={
            placeholder
          }
          className="w-full rounded-xl border border-[#EADCC4] bg-white py-3 pl-10 pr-4 text-sm text-[#5A4032] outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/15"
        />
      </div>

      {/* Category */}
      {showCategory && (
        <div className="mt-3 border-t border-[#F4E8D0] pt-3">
          <div className="mb-2 flex items-center gap-2">
            <Grid2X2
              size={18}
              className="text-[#2F6B3C]"
            />

            <p className="text-sm font-semibold text-[#5A4032]">
              Category
            </p>
          </div>

          <KBDropdown
            value={
              categoryValue
            }
            options={
              categoryOptions
            }
            onChange={
              onCategoryChange
            }
            placeholder="All Categories"
          />
        </div>
      )}
    </section>
  );
}