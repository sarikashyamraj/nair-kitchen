"use client";

import { useEffect, useState } from "react";
import {
  deleteCloudGroceryItems,
  loadCloudGrocery,
  saveCloudGroceryItems,
} from "../../services/groceryService";
import { saveCloudPantryItem } from "../../services/pantryService";
import { loadShopping } from "../../lib/shoppingStorage";
import { useToast } from "../../context/ToastContext";
import AppLayout from "../../components/AppLayout";
import Toast from "../../components/common/Toast";
import { saveCloudShoppingSession } from "../../services/shoppingSessionService";
import { saveCloudTransaction } from "../../services/budgetService";
import ShoppingHeader from "../../components/shopping/ShoppingHeader";
import ShoppingStats from "../../components/shopping/ShoppingStats";
import ShoppingTable from "../../components/shopping/ShoppingTable";
import ShoppingForm from "../../components/shopping/ShoppingForm";

import CheckoutSheet, {
  CheckoutData,
} from "../../components/grocery/CheckoutSheet";

import MobilePageHeader from "../../components/mobile/MobilePageHeader";
import MobileSearchBar from "../../components/mobile/MobileSearchBar";
import MobileFAB from "../../components/mobile/MobileFAB";

import { ShoppingItem } from "../../types/shopping";
import { ShoppingSession } from "../../types/shoppingSession";
import { GroceryTransaction } from "../../types/budget";

import { useKitchen } from "../../context/KitchenContext";
import { updatePantryFromPurchasedItems } from "../../services/finishShopping";



import { loadPreferences } from "../../lib/preferencesStorage";

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
  const {
    pantry,
    setPantry,
    shopping,
    setShopping,
  } = useKitchen();
const { showToast: showAppToast } = useToast();
  const [toastMessage, setToastMessage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] =
    useState(false);

  const [editingItem, setEditingItem] =
    useState<ShoppingItem | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [currency, setCurrency] = useState("AED");
  const [lastStore, setLastStore] =
    useState("Lulu Hypermarket");
const [isLoaded, setIsLoaded] = useState(false);
const [loadError, setLoadError] = useState("");
  const purchasedItems = shopping.filter(
    (item) => item.purchased
  );

  const notPurchasedItems = shopping.filter(
    (item) => !item.purchased
  );
useEffect(() => {
  let isMounted = true;

  async function loadGroceryData() {
    try {
      setLoadError("");

      const cloudGrocery =
        await loadCloudGrocery();

      let resolvedGrocery =
        cloudGrocery;

      if (cloudGrocery.length === 0) {
        const localGrocery =
          loadShopping();

        if (localGrocery.length > 0) {
          resolvedGrocery =
            await saveCloudGroceryItems(
              localGrocery
            );
        }
      }

      if (!isMounted) return;

      setShopping(resolvedGrocery);
    } catch (error) {
      if (!isMounted) return;

      const message =
        error instanceof Error
          ? error.message
          : "Unable to load Grocery.";

      setLoadError(message);

      showAppToast({
        type: "error",
        message,
      });
    } finally {
      if (isMounted) {
        setIsLoaded(true);
      }
    }
  }

  void loadGroceryData();

  return () => {
    isMounted = false;
  };
}, [setShopping, showAppToast]);
  useEffect(() => {
  function refreshPreferences() {
    const preferences = loadPreferences();
    setCurrency(preferences.currency);
  }

  refreshPreferences();

  const savedStore = localStorage.getItem(
    "nair-kitchen-last-store"
  );

  if (savedStore) {
    setLastStore(savedStore);
  }

  window.addEventListener(
    "preferences-updated",
    refreshPreferences
  );

  return () => {
    window.removeEventListener(
      "preferences-updated",
      refreshPreferences
    );
  };
}, []);

  function showToast(message: string) {
    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage("");
    }, 3000);
  }

  function openAddForm() {
    setEditingItem(null);
    setIsFormOpen(true);
  }

  function handleFinishShopping() {
    if (purchasedItems.length === 0) {
      showToast(
        "Please mark at least one item as purchased."
      );
      return;
    }

    setIsCheckoutOpen(true);
  }

  async function handleCompleteShopping(
  data: CheckoutData
) {
  try {
    const result =
      updatePantryFromPurchasedItems(
        pantry,
        shopping
      );

    const savedPantry =
      await Promise.all(
        result.updatedPantry.map(
          (item) =>
            saveCloudPantryItem(item)
        )
      );

    await deleteCloudGroceryItems(
      purchasedItems.map(
        (item) => item.id
      )
    );

    const shoppingSessionToSave: ShoppingSession = {
      id: crypto.randomUUID(),
      date: data.date,
      store: data.store,
      amount: data.amount,
      currency,
      notes: data.notes,
      purchasedItems,
      purchasedItemCount:
        purchasedItems.length,
      remainingItemCount:
        notPurchasedItems.length,
      completedAt:
        new Date().toISOString(),
    };

    const savedShoppingSession =
      await saveCloudShoppingSession(
        shoppingSessionToSave
      );

    const groceryTransactionToSave: GroceryTransaction = {
      id: crypto.randomUUID(),
      shoppingSessionId:
        savedShoppingSession.id,
      date: data.date,
      amount: data.amount,
      currency,
      description:
        data.notes ||
        "Grocery Shopping",
      store: data.store,
      notes: data.notes,
      itemCount:
        purchasedItems.length,
    };

    await saveCloudTransaction(
      groceryTransactionToSave
    );

    localStorage.setItem(
      "nair-kitchen-last-store",
      data.store
    );

    setLastStore(data.store);
    setPantry(savedPantry);
    setShopping(
      result.remainingShopping
    );
    setIsCheckoutOpen(false);

    window.dispatchEvent(
      new Event("budget-updated")
    );

    showToast(
      `Shopping completed. ${result.purchasedCount} items added to Pantry and ${currency} ${data.amount.toFixed(
        2
      )} recorded in Budget.`
    );
  } catch (error) {
    showAppToast({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to complete shopping.",
    });
  }
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

        {/* Mobile Complete Shopping */}
        <button
          type="button"
          onClick={handleFinishShopping}
          className="w-full rounded-xl bg-[#D89B3C] px-4 py-3 font-semibold text-white shadow-sm md:hidden"
        >
          ✅ Complete Shopping
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
      </div>

      <CheckoutSheet
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        currency={currency}
        purchasedCount={purchasedItems.length}
        remainingCount={notPurchasedItems.length}
        initialStore={lastStore}
        onComplete={handleCompleteShopping}
      />

      {toastMessage && (
        <Toast message={toastMessage} />
      )}

      <MobileFAB
        label="Add Item"
        onClick={openAddForm}
      />
    </AppLayout>
  );
}