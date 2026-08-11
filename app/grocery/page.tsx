"use client";
import {
  Check,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  deleteCloudGroceryItems,
  loadCloudGrocery,
  } from "../../services/groceryService";
import { saveCloudPantryItem } from "../../services/pantryService";
import {
  shareGroceryList,
} from "../../lib/grocery/groceryShare";
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
const [isCompletingShopping, setIsCompletingShopping] =
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

if (!isMounted) return;

setShopping(cloudGrocery);
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
async function handleShareGrocery() {
  const result =
    await shareGroceryList(
      shopping
    );

  if (
    result.method ===
    "empty"
  ) {
    showAppToast({
      type: "info",
      message:
        "There are no remaining grocery items to share.",
    });

    return;
  }

  if (
    result.method ===
    "clipboard"
  ) {
    showAppToast({
      type: "success",
      message:
        "Grocery list copied. You can paste it into WhatsApp, Notes or email.",
    });

    return;
  }

  if (
    result.method ===
    "unsupported"
  ) {
    showAppToast({
      type: "error",
      message:
        "Sharing is not supported on this device.",
    });
  }
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
  if (isCompletingShopping) {
    return;
  }

  const purchasedSnapshot = shopping.filter(
    (item) => item.purchased
  );

  const remainingSnapshot = shopping.filter(
    (item) => !item.purchased
  );

  if (purchasedSnapshot.length === 0) {
    showAppToast({
      type: "error",
      message:
        "Please mark at least one item as purchased.",
    });

    return;
  }

  setIsCompletingShopping(true);

  try {
    const result =
      updatePantryFromPurchasedItems(
        pantry,
        shopping
      );

    const savedPantry = await Promise.all(
      result.updatedPantry.map((item) =>
        saveCloudPantryItem(item)
      )
    );

    await deleteCloudGroceryItems(
      purchasedSnapshot.map((item) => item.id)
    );

    const sessionId = crypto.randomUUID();

    const shoppingSessionToSave: ShoppingSession = {
      id: sessionId,
      date: data.date,
      store: data.store,
      amount: data.amount,
      currency,
      notes: data.notes,
      purchasedItems: purchasedSnapshot,
      purchasedItemCount:
        purchasedSnapshot.length,
      remainingItemCount:
        remainingSnapshot.length,
      completedAt: new Date().toISOString(),
    };

    const savedShoppingSession =
      await saveCloudShoppingSession(
        shoppingSessionToSave
      );

    const transactionId =
      crypto.randomUUID();

    const groceryTransactionToSave: GroceryTransaction =
      {
        id: transactionId,
        shoppingSessionId:
          savedShoppingSession.id,
        date: data.date,
        amount: data.amount,
        currency,
        description:
          data.notes || "Grocery Shopping",
        store: data.store,
        notes: data.notes,
        itemCount:
          purchasedSnapshot.length,
      };

    await saveCloudTransaction(
      groceryTransactionToSave
    );

    localStorage.setItem(
      "nair-kitchen-last-store",
      data.store
    );

    localStorage.setItem(
      "kitchen-brain-last-shopping-progress",
      JSON.stringify({
        totalItems: shopping.length,
        purchasedItems:
          purchasedSnapshot.length,
        remainingItems:
          remainingSnapshot.length,
        completedAt:
          new Date().toISOString(),
      })
    );

    setLastStore(data.store);
    setPantry(savedPantry);
    setShopping(result.remainingShopping);
    setIsCheckoutOpen(false);

    window.dispatchEvent(
      new Event("budget-updated")
    );

    window.dispatchEvent(
      new Event("grocery-updated")
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

    throw error;
  } finally {
    setIsCompletingShopping(false);
  }
}
  return (
    <AppLayout>
      <div className="space-y-4 pb-36 md:pb-0">
        {/* Sticky Mobile Header and Search */}
        {/* Mobile Header and Search */}
<div className="-mx-4 bg-[#FFFDF8] px-4 pb-3 pt-1 md:hidden">
          <MobilePageHeader
            title="Grocery List"
subtitle={`${notPurchasedItems.length} ${
  notPurchasedItems.length === 1
    ? "item"
    : "items"
} to buy`}
          />

          <div className="mt-3">
            <MobileSearchBar
  searchValue={
    searchTerm
  }
  onSearchChange={
    setSearchTerm
  }
  categoryValue={
    selectedCategory
  }
  categories={
    categories
  }
  onCategoryChange={
    setSelectedCategory
  }
  placeholder="Search grocery items..."
  compact
/>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <ShoppingHeader
  onAdd={openAddForm}
  onFinishShopping={handleFinishShopping}
  onShare={handleShareGrocery}
  remainingItems={notPurchasedItems.length}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  selectedCategory={selectedCategory}
  setSelectedCategory={setSelectedCategory}
/>
        </div>
{/* Mobile Grocery Actions */}
<div className="grid grid-cols-2 gap-2 md:hidden">
  <button
    type="button"
    onClick={handleShareGrocery}
    disabled={
      notPurchasedItems.length === 0
    }
    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#2F6B3C] bg-white px-3 py-2.5 text-sm font-semibold text-[#2F6B3C] shadow-sm transition active:scale-[0.98] active:bg-[#F3F8F4] disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:shadow-none"
  >
    <Share2
      size={16}
      strokeWidth={1.9}
    />

    <span>Share List</span>
  </button>

  <button
    type="button"
    onClick={handleFinishShopping}
    disabled={
      purchasedItems.length === 0
    }
    className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D89B3C] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
  >
    <Check
      size={16}
      strokeWidth={2}
    />

    <span>Complete</span>
  </button>
</div>

        <ShoppingStats items={shopping} />

        <div className="md:pb-0">
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
</div>

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
  onClose={() => {
    if (!isCompletingShopping) {
      setIsCheckoutOpen(false);
    }
  }}
  currency={currency}
  purchasedCount={purchasedItems.length}
  remainingCount={notPurchasedItems.length}
  initialStore={lastStore}
  isCompleting={isCompletingShopping}
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