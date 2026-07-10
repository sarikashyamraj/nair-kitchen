"use client";

import { useState } from "react";

import AppLayout from "../../components/AppLayout";
import Toast from "../../components/common/Toast";

import ShoppingHeader from "../../components/shopping/ShoppingHeader";
import ShoppingStats from "../../components/shopping/ShoppingStats";
import ShoppingTable from "../../components/shopping/ShoppingTable";
import ShoppingForm from "../../components/shopping/ShoppingForm";

import MobilePageHeader from "../../components/mobile/MobilePageHeader";
import MobileSearchBar from "../../components/mobile/MobileSearchBar";
import MobileFAB from "../../components/mobile/MobileFAB";

import { ShoppingItem } from "../../types/shopping";
import { useKitchen } from "../../context/KitchenContext";
import { updatePantryFromPurchasedItems } from "../../services/finishShopping";

const categories = [
  "All",
  "Vegetables",
  "Fruits",
  "Grains",
  "Dairy",
  "Meat",
  "Seafood",
  "Spices",
  "Beverages",
  "Snacks",
  "Frozen",
  "Bakery",
  "Household",
  "Grocery",
  "Other",
];

export default function GroceryPage() {
  const { pantry, setPantry, shopping, setShopping } = useKitchen();

  const [toastMessage, setToastMessage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const purchasedItems = shopping.filter((item) => item.purchased);
  const notPurchasedItems = shopping.filter((item) => !item.purchased);

  function showToast(message: string) {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  }

  function openAddForm() {
    setEditingItem(null);
    setIsFormOpen(true);
  }

  function handleFinishShopping() {
    if (purchasedItems.length === 0) {
      showToast("Please mark at least one item as purchased.");
      return;
    }

    setIsReviewOpen(true);
  }

  function handleUpdatePantry() {
    const result = updatePantryFromPurchasedItems(pantry, shopping);

    setPantry(result.updatedPantry);
    setShopping(result.remainingShopping);
    setIsReviewOpen(false);

    showToast(`${result.purchasedCount} purchased items added to Pantry.`);
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Sticky Mobile Header and Search */}
<div className="sticky top-0 z-30 -mx-4 bg-[#FFFDF8] px-4 pb-3 pt-1 md:hidden">
  <MobilePageHeader
    title="Grocery"
    subtitle={`${notPurchasedItems.length} Items Remaining`}
  />

  <div className="mt-3">
    <MobileSearchBar
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      categoryValue={selectedCategory}
      categories={categories}
      onCategoryChange={setSelectedCategory}
      placeholder="Search grocery items..."
    />
  </div>
</div>

{/* Desktop Header */}
<div className="hidden md:block">
  <ShoppingHeader
    onAdd={openAddForm}
    onFinishShopping={handleFinishShopping}
    searchTerm={searchTerm}
    setSearchTerm={setSearchTerm}
    selectedCategory={selectedCategory}
    setSelectedCategory={setSelectedCategory}
  />
</div>

        {/* Mobile Finish Shopping */}
        <button
          type="button"
          onClick={handleFinishShopping}
          className="w-full rounded-xl bg-[#D89B3C] px-4 py-3 font-semibold text-white shadow-sm md:hidden"
        >
          ✅ Finish Shopping
        </button>

        <ShoppingStats items={shopping} />

        <ShoppingTable
          items={shopping}
          setItems={setShopping}
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
            shoppingItems={shopping}
            setShoppingItems={setShopping}
          />
        )}

        {isReviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8">
              <h2 className="text-2xl font-bold text-[#2F6B3C]">
                ✅ Shopping Review
              </h2>

              <p className="mt-2 text-gray-600">
                Review purchased and pending items before updating Pantry.
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 font-bold text-green-700">
                    Purchased Items
                  </h3>

                  {purchasedItems.length === 0 ? (
                    <p className="text-gray-500">No purchased items.</p>
                  ) : (
                    <ul className="space-y-2">
                      {purchasedItems.map((item) => (
                        <li
                          key={item.id}
                          className="rounded-xl bg-green-50 p-3"
                        >
                          ✔ {item.name} - {item.quantity}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <h3 className="mb-3 font-bold text-yellow-700">
                    Not Purchased
                  </h3>

                  {notPurchasedItems.length === 0 ? (
                    <p className="text-gray-500">All items purchased.</p>
                  ) : (
                    <ul className="space-y-2">
                      {notPurchasedItems.map((item) => (
                        <li
                          key={item.id}
                          className="rounded-xl bg-yellow-50 p-3"
                        >
                          ○ {item.name} - {item.quantity}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewOpen(false)}
                  className="rounded-xl border px-5 py-2"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUpdatePantry}
                  className="rounded-xl bg-[#2F6B3C] px-5 py-2 text-white"
                >
                  Update Pantry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {toastMessage && <Toast message={toastMessage} />}

      <MobileFAB label="Add Item" onClick={openAddForm} />
    </AppLayout>
  );
}