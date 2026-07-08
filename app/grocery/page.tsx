"use client";
import Toast from "../../components/common/Toast";
import { useState } from "react";

import AppLayout from "../../components/AppLayout";
import ShoppingHeader from "../../components/shopping/ShoppingHeader";
import ShoppingStats from "../../components/shopping/ShoppingStats";
import ShoppingTable from "../../components/shopping/ShoppingTable";
import ShoppingForm from "../../components/shopping/ShoppingForm";

import { ShoppingItem } from "../../types/shopping";
import { useKitchen } from "../../context/KitchenContext";
import { updatePantryFromPurchasedItems } from "../../services/finishShopping";

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
  function showToast(message: string) {
  setToastMessage(message);

  setTimeout(() => {
    setToastMessage("");
  }, 3000);
}
  return (
    <AppLayout>
      <div className="space-y-6">
        <ShoppingHeader
          onAdd={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          onFinishShopping={handleFinishShopping}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

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
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-[#2F6B3C]">
                ✅ Shopping Review
              </h2>

              <p className="text-gray-600 mt-2">
                Review purchased and pending items before updating Pantry.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-bold text-green-700 mb-3">
                    Purchased Items
                  </h3>

                  {purchasedItems.length === 0 ? (
                    <p className="text-gray-500">No purchased items.</p>
                  ) : (
                    <ul className="space-y-2">
                      {purchasedItems.map((item) => (
                        <li key={item.id} className="bg-green-50 p-3 rounded-xl">
                          ✔ {item.name} - {item.quantity}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-yellow-700 mb-3">
                    Not Purchased
                  </h3>

                  {notPurchasedItems.length === 0 ? (
                    <p className="text-gray-500">All items purchased.</p>
                  ) : (
                    <ul className="space-y-2">
                      {notPurchasedItems.map((item) => (
                        <li key={item.id} className="bg-yellow-50 p-3 rounded-xl">
                          ○ {item.name} - {item.quantity}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setIsReviewOpen(false)}
                  className="px-5 py-2 rounded-xl border"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdatePantry}
                  className="px-5 py-2 rounded-xl bg-[#2F6B3C] text-white"
                >
                  Update Pantry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {toastMessage && <Toast message={toastMessage} />}
    </AppLayout>
  );
}