"use client";

import { useEffect, useState } from "react";

import AppLayout from "../../components/AppLayout";
import PantryHeader from "../../components/pantry/PantryHeader";
import PantryStats from "../../components/pantry/PantryStats";
import PantryAlerts from "../../components/pantry/PantryAlerts";
import PantryTable from "../../components/pantry/PantryTable";
import AddIngredientForm from "../../components/pantry/AddIngredientForm";

import MobilePageHeader from "../../components/mobile/MobilePageHeader";
import MobileSearchBar from "../../components/mobile/MobileSearchBar";
import MobileFAB from "../../components/mobile/MobileFAB";

import { PantryItem } from "../../types/pantry";
import { useKitchen } from "../../context/KitchenContext";
import { useToast } from "../../context/ToastContext";

import {
  deleteCloudPantryItem,
  loadCloudPantry,
  saveCloudPantryItem,
} from "../../services/pantryService";

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
  const { pantry, setPantry } = useKitchen();
  const { showToast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] =
    useState<PantryItem | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPantryData() {
      try {
        setLoadError("");

        const cloudPantry =
          await loadCloudPantry();

        if (!isMounted) return;

        setPantry(cloudPantry);
      } catch (error) {
        if (!isMounted) return;

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load Pantry.";

        setLoadError(message);

        showToast({
          type: "error",
          message,
        });
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    }

    void loadPantryData();

    return () => {
      isMounted = false;
    };
  }, [setPantry, showToast]);

  function openAddForm() {
    setEditingItem(null);
    setIsFormOpen(true);
  }

  async function handleSave(item: PantryItem) {
    try {
      if (editingItem) {
        const savedItem =
          await saveCloudPantryItem({
            ...item,
            id: editingItem.id,
          });

        setPantry(
          pantry.map((pantryItem) =>
            pantryItem.id === editingItem.id
              ? savedItem
              : pantryItem
          )
        );
      } else {
        const existingItem = pantry.find(
          (pantryItem) =>
            pantryItem.name
              .trim()
              .toLowerCase() ===
              item.name.trim().toLowerCase() &&
            pantryItem.unit === item.unit &&
            pantryItem.category === item.category
        );

        if (existingItem) {
          const mergedItem: PantryItem = {
            ...existingItem,
            quantity:
              existingItem.quantity +
              item.quantity,
            minQuantity: item.minQuantity,
            notes:
              item.notes ||
              existingItem.notes,
          };

          const savedItem =
            await saveCloudPantryItem(
              mergedItem
            );

          setPantry(
            pantry.map((pantryItem) =>
              pantryItem.id ===
              existingItem.id
                ? savedItem
                : pantryItem
            )
          );
        } else {
          const savedItem =
            await saveCloudPantryItem(item);

          setPantry([
            ...pantry,
            savedItem,
          ]);
        }
      }

      const wasEditing =
        editingItem !== null;

      setEditingItem(null);
      setIsFormOpen(false);

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
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCloudPantryItem(id);

      setPantry(
        pantry.filter(
          (item) => item.id !== id
        )
      );

      showToast({
        type: "success",
        message: "Pantry item deleted.",
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

  const filteredItems = pantry.filter(
    (item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

      const matchesCategory =
        selectedCategory === "All" ||
        item.category ===
          selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  const lowStockCount = pantry.filter(
    (item) =>
      item.quantity <= item.minQuantity
  ).length;

  if (!isLoaded) {
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

  if (loadError) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          {loadError}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <MobilePageHeader
        title="Pantry"
        subtitle={`${pantry.length} Ingredients`}
      />

      <div className="hidden md:block">
        <PantryHeader
          onAddItem={openAddForm}
        />
      </div>

      <MobileSearchBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        categoryValue={
          selectedCategory
        }
        categories={categories}
        onCategoryChange={
          setSelectedCategory
        }
        placeholder="Search ingredients..."
      />

      <div className="mb-6 hidden gap-4 md:flex">
        <input
          type="text"
          placeholder="🔍 Search ingredients..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(
              event.target.value
            )
          }
          className="flex-1 rounded-xl border border-gray-300 p-3 focus:border-[#2F6B3C] focus:outline-none"
        />

        <select
          value={selectedCategory}
          onChange={(event) =>
            setSelectedCategory(
              event.target.value
            )
          }
          className="rounded-xl border border-gray-300 p-3"
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

      <PantryStats
        totalItems={pantry.length}
        lowStock={lowStockCount}
        categories={
          new Set(
            pantry.map(
              (item) => item.category
            )
          ).size
        }
      />

      <PantryAlerts items={pantry} />

      <PantryTable
        items={filteredItems}
        onEdit={(item) => {
          setEditingItem(item);
          setIsFormOpen(true);
        }}
        onDelete={handleDelete}
      />

      <MobileFAB
        label="Add"
        onClick={openAddForm}
      />

      {isFormOpen && (
        <AddIngredientForm
          itemToEdit={editingItem}
          onClose={() => {
            setEditingItem(null);
            setIsFormOpen(false);
          }}
          onSave={handleSave}
        />
      )}
    </AppLayout>
  );
}