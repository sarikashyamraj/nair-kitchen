"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Search,
} from "lucide-react";

import AppLayout from "../../components/AppLayout";

import PantryHealthHero from "../../components/pantry/PantryHealthHero";
import PantrySummaryCards from "../../components/pantry/PantrySummaryCards";
import PantryAlerts from "../../components/pantry/PantryAlerts";
import PantryListHeader from "../../components/pantry/PantryListHeader";
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
  HomeInventoryCategory,
} from "../../lib/inventory/inventoryCategories";

export default function PantryPage() {
  const {
    pantry,
    setPantry,
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

  const isSearching =
    searchTerm
      .trim()
      .length > 0;

  function openAddForm() {
    setEditingItem(null);

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

    setIsFormOpen(
      true
    );
  }

  function closeForm() {
    setEditingItem(null);

    setIsFormOpen(
      false
    );
  }

  function openCategory(
    category: HomeInventoryCategory
  ) {
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
            Loading Home
            Inventory...
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
            <section className="mb-4 flex items-start justify-between gap-4">
  <div>
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D89B3C]">
      Kitchen Brain
    </p>

    <h1 className="mt-1 text-2xl font-bold text-[#245B32] sm:text-3xl">
      Home Inventory
    </h1>

    <p className="mt-1 text-sm text-gray-500">
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

            {/* Home Inventory Search */}
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
                <PantryListHeader
                  itemCount={
                    filteredItems.length
                  }
                  sortOption={
                    sortOption
                  }
                  onSortChange={
                    setSortOption
                  }
                />

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
                      (
                        item
                      ) =>
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
                />

                {/* Items Needing Attention */}
                <PantryAlerts
                  items={
                    pantry
                  }
                />

                {/* Category Dashboard */}
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

      {/* Shared Mobile Add Button */}
      <KBFloatingButton
        label="Add"
        ariaLabel="Add inventory item"
        onClick={
          openAddForm
        }
      />

      {/* Add / Edit Item Form */}
      {isFormOpen && (
        <AddIngredientForm
          itemToEdit={
            editingItem
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