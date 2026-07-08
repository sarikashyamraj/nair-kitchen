"use client";

import { useEffect, useState } from "react";

import AppLayout from "../../components/AppLayout";

import ShoppingHeader from "../../components/shopping/ShoppingHeader";
import ShoppingStats from "../../components/shopping/ShoppingStats";
import ShoppingTable from "../../components/shopping/ShoppingTable";
import ShoppingForm from "../../components/shopping/ShoppingForm";

import { ShoppingItem } from "../../types/shopping";

import { defaultShopping } from "../../data/defaultShopping";
import { loadShopping, saveShopping } from "../../lib/shoppingStorage";

export default function ShoppingPage() {
  const [shoppingItems, setShoppingItems] =
    useState<ShoppingItem[]>(defaultShopping);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingItem, setEditingItem] =
    useState<ShoppingItem | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const saved = loadShopping();

    if (saved.length > 0) {
      setShoppingItems(saved);
    }
  }, []);

  useEffect(() => {
    saveShopping(shoppingItems);
  }, [shoppingItems]);

  return (
    <AppLayout>
      <div className="space-y-6">

        <ShoppingHeader
          onAdd={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <ShoppingStats items={shoppingItems} />

        <ShoppingTable
          items={shoppingItems}
          setItems={setShoppingItems}
          onEdit={(item) => {
            setEditingItem(item);
            setIsFormOpen(true);
          }}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />

        {isFormOpen && (
          <ShoppingForm
            item={editingItem}
            onClose={() => {
              setEditingItem(null);
              setIsFormOpen(false);
            }}
            shoppingItems={shoppingItems}
            setShoppingItems={setShoppingItems}
          />
        )}

      </div>
    </AppLayout>
  );
}