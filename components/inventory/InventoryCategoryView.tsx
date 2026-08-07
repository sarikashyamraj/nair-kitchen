"use client";

import Image from "next/image";

import {
  ArrowLeft,
  CircleAlert,
  CircleCheck,
  Search,
} from "lucide-react";

import { PantryItem } from "../../types/pantry";

import PantryListHeader from "../pantry/PantryListHeader";
import PantryTable from "../pantry/PantryTable";

import {
  PantrySortOption,
} from "../../lib/pantry/pantryFilters";

import {
  HomeInventoryCategory,
  inventoryCategoryMeta,
} from "../../lib/inventory/inventoryCategories";

import {
  inventoryCategoryImages,
} from "../../lib/inventory/inventoryCategoryImages";

import {
  analyzeInventoryCategory,
} from "../../lib/inventory/inventoryCategoryAnalyzer";

type InventoryCategoryViewProps = {
  category: HomeInventoryCategory;

  allItems: PantryItem[];

  filteredItems: PantryItem[];

  searchTerm: string;

  onSearchChange: (
    value: string
  ) => void;

  sortOption: PantrySortOption;

  onSortChange: (
    value: PantrySortOption
  ) => void;

  onBack: () => void;

  onEdit: (
    item: PantryItem
  ) => void;

  onDelete: (
    id: string
  ) => void;
};

export default function InventoryCategoryView({
  category,
  allItems,
  filteredItems,
  searchTerm,
  onSearchChange,
  sortOption,
  onSortChange,
  onBack,
  onEdit,
  onDelete,
}: InventoryCategoryViewProps) {
  const categoryMeta =
    inventoryCategoryMeta.find(
      (item) =>
        item.name === category
    );

  const summary =
    analyzeInventoryCategory(
      allItems,
      category
    );

  const categoryImage =
    inventoryCategoryImages[
      category
    ];

  const attentionCount =
    summary.lowStock +
    summary.outOfStock;

  return (
    <div className="space-y-4">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl px-1 text-sm font-semibold text-[#2F6B3C] transition active:scale-[0.98]"
      >
        <ArrowLeft
          size={18}
        />

        All Categories
      </button>

      {/* Category Hero */}
      <section className="overflow-hidden rounded-2xl border border-[#EADCC4] bg-white shadow-sm">
        <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[150px_1fr]">
          <div className="relative min-h-[120px] overflow-hidden bg-[#F8F4EC]">
            <Image
              src={categoryImage}
              alt={category}
              fill
              sizes="150px"
              className="object-cover object-[center_15%]"
              priority
            />
          </div>

          <div className="flex min-w-0 flex-col justify-center p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D89B3C]">
              Home Inventory
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#245B32]">
              {category}
            </h1>

            <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 sm:text-sm">
              {categoryMeta?.description ??
                "Manage items in this category."}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#F8F4EC] px-2.5 py-1 text-[11px] font-semibold text-[#5A4032]">
                {summary.totalItems}{" "}
                {summary.totalItems ===
                1
                  ? "item"
                  : "items"}
              </span>

              {attentionCount >
              0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                  <CircleAlert
                    size={12}
                  />

                  {attentionCount} need
                  attention
                </span>
              ) : summary.totalItems >
                0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                  <CircleCheck
                    size={12}
                  />

                  All stocked
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="rounded-2xl border border-[#EADCC4] bg-white p-3 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) =>
              onSearchChange(
                event.target.value
              )
            }
            placeholder={`Search ${category.toLowerCase()}...`}
            className="w-full rounded-xl border border-[#EADCC4] bg-white py-3 pl-10 pr-4 text-sm text-[#5A4032] outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/15"
          />
        </div>
      </section>

      {/* Stock Overview */}
      <section className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-green-100 bg-green-50 px-2 py-3 text-center">
          <p className="text-lg font-bold text-green-700">
            {summary.inStock}
          </p>

          <p className="mt-0.5 text-[10px] font-medium text-green-700">
            In Stock
          </p>
        </div>

        <div className="rounded-xl border border-amber-100 bg-amber-50 px-2 py-3 text-center">
          <p className="text-lg font-bold text-amber-700">
            {summary.lowStock}
          </p>

          <p className="mt-0.5 text-[10px] font-medium text-amber-700">
            Running Low
          </p>
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50 px-2 py-3 text-center">
          <p className="text-lg font-bold text-red-700">
            {summary.outOfStock}
          </p>

          <p className="mt-0.5 text-[10px] font-medium text-red-700">
            Out of Stock
          </p>
        </div>
      </section>

      {/* Items */}
      <div>
        <PantryListHeader
          itemCount={
            filteredItems.length
          }
          sortOption={
            sortOption
          }
          onSortChange={
            onSortChange
          }
        />

        <PantryTable
          items={
            filteredItems
          }
          onEdit={
            onEdit
          }
          onDelete={
            onDelete
          }
        />
      </div>
    </div>
  );
}