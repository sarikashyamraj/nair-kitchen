"use client";

import {
  useMemo,
  useState,
} from "react";

import AppLayout from "../../components/AppLayout";
import PantryHeader from "../../components/pantry/PantryHeader";
import PantryHealthHero from "../../components/pantry/PantryHealthHero";
import PantrySummaryCards from "../../components/pantry/PantrySummaryCards";
import PantryAlerts from "../../components/pantry/PantryAlerts";
import PantryListHeader from "../../components/pantry/PantryListHeader";
import PantryTable from "../../components/pantry/PantryTable";
import AddIngredientForm from "../../components/pantry/AddIngredientForm";


import MobileSearchBar from "../../components/mobile/MobileSearchBar";
import MobileFAB from "../../components/mobile/MobileFAB";

import { PantryItem } from "../../types/pantry";
import { useKitchen } from "../../context/KitchenContext";
import { useToast } from "../../context/ToastContext";

import {
  deleteCloudPantryItem,
  saveCloudPantryItem,
} from "../../services/pantryService";

import { analyzePantry } from "../../lib/pantry/pantryAnalyzer";

import {
  filterPantryItems,
  findMatchingPantryItem,
  PantrySortOption,
} from "../../lib/pantry/pantryFilters";

const categories = [
  "All",
  "Grains",
  "Dairy",
  "Vegetables",
  "Meat",
  "Seafood",
  "Spices",
  "Snacks",
  "Household",
];

export default function PantryPage() {
  const {
    pantry,
    setPantry,
    isKitchenLoaded,
  } = useKitchen();

  const { showToast } = useToast();

  const [
    isFormOpen,
    setIsFormOpen,
  ] = useState(false);

  const [
    editingItem,
    setEditingItem,
  ] = useState<PantryItem | null>(
    null
  );

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [
    sortOption,
    setSortOption,
  ] = useState<PantrySortOption>(
    "attention"
  );

  const pantrySummary = useMemo(
    () => analyzePantry(pantry),
    [pantry]
  );

  const filteredItems = useMemo(
    () =>
      filterPantryItems(pantry, {
        searchTerm,
        category: selectedCategory,
        sortOption,
      }),
    [
      pantry,
      searchTerm,
      selectedCategory,
      sortOption,
    ]
  );

  function openAddForm() {
    setEditingItem(null);
    setIsFormOpen(true);
  }

  function openEditForm(
    item: PantryItem
  ) {
    setEditingItem(item);
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingItem(null);
    setIsFormOpen(false);
  }

  async function handleSave(
    item: PantryItem
  ) {
    try {
      const wasEditing =
        editingItem !== null;

      if (editingItem) {
        const savedItem =
          await saveCloudPantryItem({
            ...item,
            id: editingItem.id,
          });

        setPantry(
          (currentPantry) =>
            currentPantry.map(
              (pantryItem) =>
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
          const mergedItem: PantryItem =
            {
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
            (currentPantry) =>
              currentPantry.map(
                (pantryItem) =>
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
            (currentPantry) => [
              ...currentPantry,
              savedItem,
            ]
          );
        }
      }

      closeForm();

      showToast({
        type: "success",
        message: wasEditing
          ? "Pantry item updated."
          : "Pantry item saved.",
      });
    } catch (error) {
      showToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save Pantry item.",
      });

      throw error;
    }
  }

  async function handleDelete(
    id: string
  ) {
    try {
      await deleteCloudPantryItem(id);

      setPantry(
        (currentPantry) =>
          currentPantry.filter(
            (item) => item.id !== id
          )
      );

      showToast({
        type: "success",
        message:
          "Pantry item deleted.",
      });
    } catch (error) {
      showToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete Pantry item.",
      });
    }
  }

  if (!isKitchenLoaded) {
    return (
      <AppLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="font-semibold text-[#2F6B3C]">
            Loading Pantry...
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      

      <div className="hidden md:block">
        <PantryHeader
          onAddItem={openAddForm}
        />
      </div>

      <MobileSearchBar
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  categoryValue={selectedCategory}
  categories={categories}
  onCategoryChange={setSelectedCategory}
  placeholder="Search ingredients..."
/>

      <section className="mb-5 hidden rounded-2xl border border-[#EADCC4] bg-white p-4 shadow-sm md:block">
        <div className="grid grid-cols-[1fr_240px] gap-4">
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            className="rounded-xl border border-[#EADCC4] bg-white px-4 py-3 text-[#5A4032] outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/15"
          />

          <select
            value={
              selectedCategory
            }
            onChange={(event) =>
              setSelectedCategory(
                event.target.value
              )
            }
            className="rounded-xl border border-[#EADCC4] bg-white px-4 py-3 text-[#5A4032] outline-none transition focus:border-[#2F6B3C]"
          >
            {categories.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}
          </select>
        </div>
      </section>

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
        outOfStockNames={pantrySummary.outOfStockItems.map(
          (item) => item.name
        )}
      />

      <PantryAlerts
        items={pantry}
      />

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
        items={filteredItems}
        onEdit={openEditForm}
        onDelete={handleDelete}
      />

      <MobileFAB
        label="Add"
        onClick={openAddForm}
      />

      {isFormOpen && (
        <AddIngredientForm
          itemToEdit={
            editingItem
          }
          onClose={closeForm}
          onSave={handleSave}
        />
      )}
    </AppLayout>
  );
}