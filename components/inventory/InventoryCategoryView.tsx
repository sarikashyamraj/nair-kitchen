"use client";

import Image from "next/image";

import {
  ArrowLeft,
  CircleAlert,
  CircleCheck,
  Plus,
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

import {
  typography,
} from "../../lib/theme/typography";

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

  onAddItem: () => void;

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
  onAddItem,
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
        className={`${typography.bodyMedium} inline-flex min-h-10 items-center gap-2 rounded-xl px-1 text-[#2F6B3C] transition active:scale-[0.98]`}
      >
        <ArrowLeft
          size={17}
          strokeWidth={1.9}
        />

        All Categories
      </button>

      {/* Category Hero */}
      <section className="overflow-hidden rounded-2xl border border-[#E8DED1] bg-white shadow-sm">
        <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr]">
          <div className="relative min-h-[132px] overflow-hidden bg-[#F8F4EC]">
            <Image
              src={categoryImage}
              alt={category}
              fill
              sizes="160px"
              className="object-cover object-[center_15%]"
              priority
            />
          </div>

          <div className="flex min-w-0 flex-col justify-center p-4 sm:p-5">
            <p
              className={`${typography.eyebrow} text-[#C9872F]`}
            >
              Home Inventory
            </p>

            <h1
              className={`${typography.pageTitle} mt-1 text-[#245B32]`}
            >
              {category}
            </h1>

            <p
              className={`${typography.pageDescription} mt-1 line-clamp-2 text-[#7A746C]`}
            >
              {categoryMeta?.description ??
                "Manage items in this category."}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`${typography.badge} rounded-full bg-[#F8F4EC] px-2.5 py-1 font-medium text-[#5A4032]`}
              >
                {summary.totalItems}{" "}
                {summary.totalItems === 1
                  ? "item"
                  : "items"}
              </span>

              {attentionCount > 0 ? (
                <span
                  className={`${typography.badge} inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[#A86612]`}
                >
                  <CircleAlert
                    size={11}
                    strokeWidth={1.9}
                  />

                  {attentionCount} need attention
                </span>
              ) : summary.totalItems > 0 ? (
                <span
                  className={`${typography.badge} inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-green-700`}
                >
                  <CircleCheck
                    size={11}
                    strokeWidth={1.9}
                  />

                  All stocked
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="rounded-2xl border border-[#E8DED1] bg-white p-3 shadow-sm">
        <div className="relative">
          <Search
            size={17}
            strokeWidth={1.9}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9A938B]"
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
            className={`${typography.body} w-full rounded-xl border border-[#EADCC4] bg-white py-3 pl-10 pr-4 text-[#5A4032] outline-none transition placeholder:text-[#AAA39B] focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/15`}
          />
        </div>
      </section>

      {/* Stock Overview */}
      <section className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-green-100 bg-[#F7FBF7] px-2 py-3 text-center">
          <p
            className={`${typography.stat} text-green-700`}
          >
            {summary.inStock}
          </p>

          <p
            className={`${typography.caption} mt-1 font-medium text-green-700`}
          >
            In Stock
          </p>
        </div>

        <div className="rounded-xl border border-amber-100 bg-[#FFF9EF] px-2 py-3 text-center">
          <p
            className={`${typography.stat} text-[#B87516]`}
          >
            {summary.lowStock}
          </p>

          <p
            className={`${typography.caption} mt-1 font-medium text-[#B87516]`}
          >
            Running Low
          </p>
        </div>

        <div className="rounded-xl border border-red-100 bg-[#FFF7F6] px-2 py-3 text-center">
          <p
            className={`${typography.stat} text-red-600`}
          >
            {summary.outOfStock}
          </p>

          <p
            className={`${typography.caption} mt-1 font-medium text-red-600`}
          >
            Out of Stock
          </p>
        </div>
      </section>

      {/* Items */}
      <div>
        <div className="mb-3 flex items-center gap-3">
          <div className="min-w-0 flex-1">
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
          </div>

          {/* Desktop Add Item */}
          <button
            type="button"
            onClick={onAddItem}
            className={`${typography.button} hidden min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2F6B3C] px-4 text-white shadow-sm transition hover:bg-[#245B32] active:scale-[0.98] md:inline-flex`}
          >
            <Plus
              size={17}
              strokeWidth={1.9}
            />

            Add Item
          </button>
        </div>

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