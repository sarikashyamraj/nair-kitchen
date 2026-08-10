"use client";
import {
  mergeInventoryItemsIntoGrocery,
} from "../../services/inventoryToGrocery";
import {
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  BadgeCheck,
  PackageOpen,
  PackageX,
  Plus,
  Search,
  TrendingDown,
} from "lucide-react";
import { typography } from "../../lib/theme/typography";
import AppLayout from "../../components/AppLayout";

import PantryHealthHero from "../../components/pantry/PantryHealthHero";
import PantrySummaryCards, {
  PantrySummaryFilter,
} from "../../components/pantry/PantrySummaryCards";

import PantryTable from "../../components/pantry/PantryTable";
import AddIngredientForm from "../../components/pantry/AddIngredientForm";

import InventoryCategoryGrid from "../../components/inventory/InventoryCategoryGrid";
import InventoryCategoryView from "../../components/inventory/InventoryCategoryView";

import KBFloatingButton from "../../components/ui/KBFloatingButton";

import { PantryItem } from "../../types/pantry";

import {
  useKitchen,
} from "../../context/KitchenContext";

import {
  useToast,
} from "../../context/ToastContext";

import {
  deleteCloudPantryItem,
  saveCloudPantryItem,
} from "../../services/pantryService";

import {
  analyzePantry,
} from "../../lib/pantry/pantryAnalyzer";

import {
  filterPantryItems,
  findMatchingPantryItem,
  PantrySortOption,
} from "../../lib/pantry/pantryFilters";

import {
  getPantryStockStatus,
} from "../../lib/pantry/pantryStatus";

import {
  HomeInventoryCategory,
} from "../../lib/inventory/inventoryCategories";

export default function PantryPage() {
  const {
  pantry,
  setPantry,
  shopping,
  setShopping,
  isKitchenLoaded,
} = useKitchen();

  const {
    showToast,
  } = useToast();

  const [
    isFormOpen,
    setIsFormOpen,
  ] = useState(false);

  const [
    editingItem,
    setEditingItem,
  ] =
    useState<PantryItem | null>(
      null
    );

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    activeCategory,
    setActiveCategory,
  ] =
    useState<HomeInventoryCategory | null>(
      null
    );

  const [
    activeSummaryFilter,
    setActiveSummaryFilter,
  ] =
    useState<PantrySummaryFilter | null>(
      null
    );

  const [
    addFormCategory,
    setAddFormCategory,
  ] =
    useState<HomeInventoryCategory | null>(
      null
    );

  const [
    sortOption,
    setSortOption,
  ] =
    useState<PantrySortOption>(
      "attention"
    );

  const pantrySummary =
    useMemo(
      () =>
        analyzePantry(
          pantry
        ),
      [pantry]
    );

  const filteredItems =
    useMemo(
      () =>
        filterPantryItems(
          pantry,
          {
            searchTerm,

            category:
              activeCategory ??
              "All",

            sortOption,
          }
        ),
      [
        pantry,
        searchTerm,
        activeCategory,
        sortOption,
      ]
    );

  const summaryItems =
    useMemo(() => {
      if (
        !activeSummaryFilter
      ) {
        return [];
      }

      if (
        activeSummaryFilter ===
        "all"
      ) {
        return pantry;
      }

      return pantry.filter(
        (item) =>
          getPantryStockStatus(
            item
          ) ===
          activeSummaryFilter
      );
    }, [
      pantry,
      activeSummaryFilter,
    ]);

  const isSearching =
    searchTerm
      .trim()
      .length > 0;

  function openAddForm() {
    setEditingItem(null);

    setAddFormCategory(
      activeCategory
    );

    setIsFormOpen(
      true
    );
  }

  function openEditForm(
    item: PantryItem
  ) {
    setEditingItem(
      item
    );

    setAddFormCategory(
      null
    );

    setIsFormOpen(
      true
    );
  }

  function closeForm() {
    setEditingItem(null);

    setAddFormCategory(
      null
    );

    setIsFormOpen(
      false
    );
  }

  function openCategory(
    category: HomeInventoryCategory
  ) {
    setActiveSummaryFilter(
      null
    );

    setActiveCategory(
      category
    );

    setSearchTerm("");

    setSortOption(
      "attention"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function closeCategory() {
    setActiveCategory(
      null
    );

    setSearchTerm("");

    setSortOption(
      "attention"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function openSummaryFilter(
    filter: PantrySummaryFilter
  ) {
    setActiveCategory(
      null
    );

    setActiveSummaryFilter(
      filter
    );

    setSearchTerm("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function closeSummaryFilter() {
    setActiveSummaryFilter(
      null
    );

    setSearchTerm("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
async function handleAddSummaryToGrocery() {
  if (!activeSummaryFilter) {
    return;
  }

  if (
    activeSummaryFilter !== "low_stock" &&
    activeSummaryFilter !== "out_of_stock"
  ) {
    return;
  }

  if (summaryItems.length === 0) {
    showToast({
      type: "warning",
      message: "There are no items to add to Grocery.",
    });

    return;
  }

  try {
    const result =
      await mergeInventoryItemsIntoGrocery(
        summaryItems,
        shopping
      );

    setShopping(result.shopping);

    showToast({
      type: "success",
      message:
        result.addedCount === 0 &&
        result.updatedCount === 0
          ? "Grocery already covers these inventory items."
          : `Grocery updated. ${result.addedCount} added and ${result.updatedCount} updated.`,
    });
  } catch (error) {
    showToast({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to add inventory items to Grocery.",
    });
  }
}
  async function handleSave(
    item: PantryItem
  ) {
    try {
      const wasEditing =
        editingItem !== null;

      if (editingItem) {
        const savedItem =
          await saveCloudPantryItem(
            {
              ...item,
              id:
                editingItem.id,
            }
          );

        setPantry(
          (
            currentPantry
          ) =>
            currentPantry.map(
              (
                pantryItem
              ) =>
                pantryItem.id ===
                editingItem.id
                  ? savedItem
                  : pantryItem
            )
        );
      } else {
        const existingItem =
          findMatchingPantryItem(
            pantry,
            item
          );

        if (existingItem) {
          const mergedItem:
            PantryItem = {
            ...existingItem,

            quantity:
              existingItem.quantity +
              item.quantity,

            minQuantity:
              item.minQuantity,

            notes:
              item.notes?.trim() ||
              existingItem.notes,
          };

          const savedItem =
            await saveCloudPantryItem(
              mergedItem
            );

          setPantry(
            (
              currentPantry
            ) =>
              currentPantry.map(
                (
                  pantryItem
                ) =>
                  pantryItem.id ===
                  existingItem.id
                    ? savedItem
                    : pantryItem
              )
          );
        } else {
          const savedItem =
            await saveCloudPantryItem(
              item
            );

          setPantry(
            (
              currentPantry
            ) => [
              ...currentPantry,
              savedItem,
            ]
          );
        }
      }

      closeForm();

      showToast({
        type: "success",

        message:
          wasEditing
            ? "Inventory item updated."
            : "Inventory item saved.",
      });
    } catch (error) {
      showToast({
        type: "error",

        message:
          error instanceof
          Error
            ? error.message
            : "Unable to save inventory item.",
      });

      throw error;
    }
  }

  async function handleDelete(
    id: string
  ) {
    try {
      await deleteCloudPantryItem(
        id
      );

      setPantry(
        (
          currentPantry
        ) =>
          currentPantry.filter(
            (item) =>
              item.id !== id
          )
      );

      showToast({
        type: "success",

        message:
          "Inventory item deleted.",
      });
    } catch (error) {
      showToast({
        type: "error",

        message:
          error instanceof
          Error
            ? error.message
            : "Unable to delete inventory item.",
      });
    }
  }

  if (!isKitchenLoaded) {
    return (
      <AppLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="font-semibold text-[#2F6B3C]">
            Loading Home Inventory...
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="pb-28 md:pb-0">
        {activeCategory ? (
          <InventoryCategoryView
            category={
              activeCategory
            }
            allItems={
              pantry
            }
            filteredItems={
              filteredItems
            }
            searchTerm={
              searchTerm
            }
            onSearchChange={
              setSearchTerm
            }
            sortOption={
              sortOption
            }
            onSortChange={
              setSortOption
            }
            onBack={
              closeCategory
            }
            onAddItem={
              openAddForm
            }
            onEdit={
              openEditForm
            }
            onDelete={
              handleDelete
            }
          />
        ) : activeSummaryFilter ? (
          <InventorySummaryView
  filter={
    activeSummaryFilter
  }
  items={
    summaryItems
  }
  onBack={
    closeSummaryFilter
  }
  onAddToGrocery={
    handleAddSummaryToGrocery
  }
  onEdit={
    openEditForm
  }
  onDelete={
    handleDelete
  }
/>
          
        ) : (
          <>
            {/* Home Inventory Header */}
<section className="flex items-start justify-between gap-4">
  <div className="min-w-0">
    <p
      className={`${typography.eyebrow} text-[#C9872F]`}
    >
      Kitchen Brain
    </p>

    <h1
      className={`${typography.pageTitle} mt-1 text-[#245B32]`}
    >
      Home Inventory
    </h1>

    <p
      className={`${typography.pageDescription} mt-1 text-[#7A746C]`}
    >
      Manage everything your home needs.
    </p>
  </div>

  <button
    type="button"
    onClick={openAddForm}
    className="hidden min-h-11 shrink-0 items-center gap-2 rounded-xl bg-[#2F6B3C] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#245B32] active:scale-[0.98] md:inline-flex"
  >
    <Plus size={18} />

    Add Item
  </button>
</section>

            {/* Search */}
            <InventorySearch
              value={
                searchTerm
              }
              onChange={
                setSearchTerm
              }
              placeholder="Search your home inventory..."
            />

            {isSearching ? (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#245B32]">
                    Search Results
                  </h2>

                  <span className="text-sm text-gray-500">
                    {
                      filteredItems.length
                    }{" "}
                    {filteredItems.length ===
                    1
                      ? "item"
                      : "items"}
                  </span>
                </div>

                <PantryTable
                  items={
                    filteredItems
                  }
                  onEdit={
                    openEditForm
                  }
                  onDelete={
                    handleDelete
                  }
                />
              </>
            ) : (
              <>
                {/* Inventory Health */}
                <PantryHealthHero
                  pantryHealth={
                    pantrySummary.pantryHealth
                  }
                  lowStock={
                    pantrySummary.lowStock
                  }
                  outOfStock={
                    pantrySummary.outOfStock
                  }
                  outOfStockNames={
                    pantrySummary.outOfStockItems.map(
                      (item) =>
                        item.name
                    )
                  }
                />

                {/* Inventory Summary */}
                <PantrySummaryCards
                  totalItems={
                    pantrySummary.totalItems
                  }
                  inStock={
                    pantrySummary.inStock
                  }
                  lowStock={
                    pantrySummary.lowStock
                  }
                  outOfStock={
                    pantrySummary.outOfStock
                  }
                  onSelect={
                    openSummaryFilter
                  }
                />

                

                {/* Categories */}
                <InventoryCategoryGrid
                  items={
                    pantry
                  }
                  onCategorySelect={
                    openCategory
                  }
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Mobile Add */}
      <KBFloatingButton
        label="Add"
        ariaLabel="Add inventory item"
        onClick={
          openAddForm
        }
      />

      {/* Add / Edit Form */}
      {isFormOpen && (
        <AddIngredientForm
          itemToEdit={
            editingItem
          }
          initialCategory={
            addFormCategory
          }
          onClose={
            closeForm
          }
          onSave={
            handleSave
          }
        />
      )}
    </AppLayout>
  );
}

/* ==========================================
   Summary Drill-down
========================================== */

type InventorySummaryViewProps = {
  filter: PantrySummaryFilter;

  items: PantryItem[];

  onBack: () => void;

  onAddToGrocery: () => void;

  onEdit: (
    item: PantryItem
  ) => void;

  onDelete: (
    id: string
  ) => void;
};

function InventorySummaryView({
  filter,
  items,
  onBack,
  onAddToGrocery,
  onEdit,
  onDelete,
}: InventorySummaryViewProps) {
  const viewContent: Record<
    PantrySummaryFilter,
    {
      title: string;
      description: string;
    }
  > = {
    all: {
      title: "All Inventory",
      description:
        "Everything currently tracked in your Home Inventory.",
    },

    in_stock: {
      title: "In Stock",
      description:
        "Items that currently have healthy stock levels.",
    },

    low_stock: {
      title: "Running Low",
      description:
        "Items that are at or below their minimum stock level.",
    },

    out_of_stock: {
      title: "Out of Stock",
      description:
        "Items that currently need to be replenished.",
    },
  };

  const content =
    viewContent[filter];

  const showGroceryAction =
    filter === "low_stock" ||
    filter === "out_of_stock";

  const statusPresentation =
    filter === "all"
      ? {
          icon: PackageOpen,
          iconClass:
            "bg-[#EEF5F0] text-[#2F6B3C]",
        }
      : filter === "in_stock"
        ? {
            icon: BadgeCheck,
            iconClass:
              "bg-green-100 text-green-700",
          }
        : filter === "low_stock"
          ? {
              icon: TrendingDown,
              iconClass:
                "bg-amber-100 text-[#B87516]",
            }
          : {
              icon: PackageX,
              iconClass:
                "bg-red-100 text-red-600",
            };

  const StatusIcon =
    statusPresentation.icon;

  const countLabel =
    filter === "low_stock"
      ? `${items.length} ${
          items.length === 1
            ? "item"
            : "items"
        } need restocking`
      : filter === "out_of_stock"
        ? `${items.length} ${
            items.length === 1
              ? "item"
              : "items"
          } need replenishing`
        : filter === "in_stock"
          ? `${items.length} ${
              items.length === 1
                ? "item"
                : "items"
            } in stock`
          : `${items.length} ${
              items.length === 1
                ? "item"
                : "items"
            }`;
const heroClass =
  filter === "low_stock"
    ? "border-amber-100 bg-[#FFFCF5]"
    : filter === "out_of_stock"
      ? "border-red-100 bg-[#FFF9F8]"
      : filter === "in_stock"
        ? "border-green-100 bg-[#F8FCF8]"
        : "border-[#E8DED1] bg-white";
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

        Home Inventory
      </button>

      {/* Summary Header */}
      <section
  className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${heroClass}`}
>
        <p
          className={`${typography.eyebrow} text-[#C9872F]`}
        >
          Home Inventory
        </p>

        <div className="mt-2 flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${statusPresentation.iconClass}`}
          >
            <StatusIcon
              size={20}
              strokeWidth={1.8}
            />
          </div>

          <div className="min-w-0">
            <h1
              className={`${typography.pageTitle} whitespace-nowrap text-[#245B32]`}
            >
              {content.title}
            </h1>

            <p
              className={`${typography.pageDescription} mt-1 max-w-md text-[#7A746C]`}
            >
              {content.description}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span
            className={`${typography.caption} rounded-full bg-[#F8F4EC] px-3 py-2 font-medium text-[#5A4032]`}
          >
            {countLabel}
          </span>

          {showGroceryAction && (
            <button
              type="button"
              onClick={onAddToGrocery}
              disabled={
                items.length === 0
              }
              className={`${typography.button} inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-[#2F6B3C] px-4 py-3 text-white shadow-sm transition hover:bg-[#245B32] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50`}
            >
              Add All to Grocery
            </button>
          )}
        </div>
      </section>

      <PantryTable
        items={items}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}

/* ==========================================
   Search
========================================== */

type InventorySearchProps = {
  value: string;

  onChange: (
    value: string
  ) => void;

  placeholder: string;
};

function InventorySearch({
  value,
  onChange,
  placeholder,
}: InventorySearchProps) {
  return (
    <section className="mb-4 rounded-2xl border border-[#EADCC4] bg-white p-3 shadow-sm">
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="search"
          value={
            value
          }
          onChange={(
            event
          ) =>
            onChange(
              event.target.value
            )
          }
          placeholder={
            placeholder
          }
          className="w-full rounded-xl border border-[#EADCC4] bg-white py-3 pl-10 pr-4 text-sm text-[#5A4032] outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/15"
        />
      </div>
    </section>
  );
}