"use client";

import { useState } from "react";

import AppLayout from "../../components/AppLayout";
import PantryHeader from "../../components/pantry/PantryHeader";
import PantryStats from "../../components/pantry/PantryStats";
import PantryAlerts from "../../components/pantry/PantryAlerts";
import PantryTable from "../../components/pantry/PantryTable";
import AddIngredientForm from "../../components/pantry/AddIngredientForm";

import { PantryItem } from "../../types/pantry";
import { useKitchen } from "../../context/KitchenContext";

export default function PantryPage() {
  const { pantry, setPantry } = useKitchen();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  function handleSave(item: PantryItem) {
    if (editingItem) {
      setPantry(
        pantry.map((pantryItem) =>
          pantryItem.id === editingItem.id ? item : pantryItem
        )
      );
    } else {
      setPantry([...pantry, item]);
    }

    setEditingItem(null);
    setIsFormOpen(false);
  }

  const filteredItems = pantry.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const lowStockCount = pantry.filter(
    (item) => item.quantity <= item.minQuantity
  ).length;

  return (
    <AppLayout>
      <PantryHeader
        onAddItem={() => {
          setEditingItem(null);
          setIsFormOpen(true);
        }}
      />

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="🔍 Search ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-xl border border-gray-300 p-3 focus:border-[#2F6B3C] focus:outline-none"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-gray-300 p-3"
        >
          <option>All</option>
          <option>Grains</option>
          <option>Dairy</option>
          <option>Vegetables</option>
          <option>Meat</option>
          <option>Seafood</option>
          <option>Spices</option>
          <option>Snacks</option>
          <option>Household</option>
        </select>
      </div>

      <PantryStats
        totalItems={pantry.length}
        lowStock={lowStockCount}
        categories={new Set(pantry.map((item) => item.category)).size}
      />

      <PantryAlerts items={pantry} />

      <PantryTable
        items={filteredItems}
        onEdit={(item) => {
          setEditingItem(item);
          setIsFormOpen(true);
        }}
        onDelete={(id) =>
          setPantry(pantry.filter((item) => item.id !== id))
        }
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