"use client";

import { useEffect, useMemo, useState } from "react";

import BottomSheet from "../ui/BottomSheet";

import { getRegionalStores } from "../../data/regionalStores";
import { loadPreferences } from "../../lib/preferencesStorage";

import {
  getCombinedStoreList,
  loadCustomStores,
  loadLastStore,
  loadRecentStores,
  saveCustomStore,
  saveRecentStore,
} from "../../lib/storePreferences";

export type CheckoutData = {
  date: string;
  store: string;
  amount: number;
  notes: string;
};

type CheckoutSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  currency: string;
  purchasedCount: number;
  remainingCount: number;
  initialStore?: string;
  onComplete: (data: CheckoutData) => void;
};

const ADD_CUSTOM_STORE = "__add_custom_store__";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function CheckoutSheet({
  isOpen,
  onClose,
  currency,
  purchasedCount,
  remainingCount,
  initialStore = "",
  onComplete,
}: CheckoutSheetProps) {
  const [shoppingDate, setShoppingDate] = useState(getTodayDate());
  const [country, setCountry] = useState("United Arab Emirates");

  const [store, setStore] = useState("");
  const [customStore, setCustomStore] = useState("");
  const [isCustomStoreOpen, setIsCustomStoreOpen] = useState(false);

  const [recentStores, setRecentStores] = useState<string[]>([]);
  const [customStores, setCustomStores] = useState<string[]>([]);

  const [billAmount, setBillAmount] = useState("");
  const [notes, setNotes] = useState("Weekly Grocery");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const preferences = loadPreferences();
    const savedLastStore = loadLastStore();
    const savedRecentStores = loadRecentStores();
    const savedCustomStores = loadCustomStores();

    const regionalStores = getRegionalStores(
      preferences.country
    );

    const defaultStore =
      savedLastStore ||
      initialStore ||
      regionalStores[0] ||
      "";

    setShoppingDate(getTodayDate());
    setCountry(preferences.country);
    setRecentStores(savedRecentStores);
    setCustomStores(savedCustomStores);
    setStore(defaultStore);

    setCustomStore("");
    setIsCustomStoreOpen(false);

    setBillAmount("");
    setNotes("Weekly Grocery");
    setErrorMessage("");
  }, [isOpen, initialStore]);

  const regionalStores = useMemo(
    () => getRegionalStores(country),
    [country]
  );

  const availableStores = useMemo(
    () =>
      getCombinedStoreList(
        regionalStores,
        recentStores,
        customStores
      ),
    [regionalStores, recentStores, customStores]
  );

  function handleStoreChange(value: string) {
    if (value === ADD_CUSTOM_STORE) {
      setIsCustomStoreOpen(true);
      setCustomStore("");
      setStore("");
      return;
    }

    setStore(value);
    setIsCustomStoreOpen(false);
    setCustomStore("");
    setErrorMessage("");
  }

  function handleAddCustomStore() {
    const cleanedStore = customStore.trim();

    if (!cleanedStore) {
      setErrorMessage("Please enter the store name.");
      return;
    }

    saveCustomStore(cleanedStore);

    setCustomStores(loadCustomStores());
    setRecentStores(loadRecentStores());

    setStore(cleanedStore);
    setCustomStore("");
    setIsCustomStoreOpen(false);
    setErrorMessage("");
  }

  function handleComplete() {
    const amount = Number(billAmount);
    const selectedStore = isCustomStoreOpen
      ? customStore.trim()
      : store.trim();

    if (purchasedCount === 0) {
      setErrorMessage(
        "Please mark at least one grocery item as purchased."
      );
      return;
    }

    if (!shoppingDate) {
      setErrorMessage("Please select the shopping date.");
      return;
    }

    if (!selectedStore) {
      setErrorMessage(
        "Please select or add a grocery store."
      );
      return;
    }

    if (!amount || amount <= 0) {
      setErrorMessage(
        "Please enter a valid bill amount."
      );
      return;
    }

    if (isCustomStoreOpen) {
      saveCustomStore(selectedStore);
    } else {
      saveRecentStore(selectedStore);
    }

    setErrorMessage("");

    onComplete({
      date: shoppingDate,
      store: selectedStore,
      amount,
      notes: notes.trim() || "Grocery Shopping",
    });
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      title="Shopping Summary"
      onClose={onClose}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-700">
              Purchased
            </p>

            <p className="mt-1 text-3xl font-bold text-green-800">
              {purchasedCount}
            </p>
          </div>

          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-700">
              Remaining
            </p>

            <p className="mt-1 text-3xl font-bold text-yellow-800">
              {remainingCount}
            </p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#5A4032]">
            Shopping Date
          </label>

          <input
            type="date"
            value={shoppingDate}
            onChange={(event) =>
              setShoppingDate(event.target.value)
            }
            className="w-full rounded-xl border border-[#EADCC4] bg-white px-4 py-3 outline-none focus:border-[#2F6B3C]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#5A4032]">
            Store
          </label>

          <p className="mb-2 text-xs text-gray-500">
            Suggestions for {country}
          </p>

          <select
            value={
              isCustomStoreOpen
                ? ADD_CUSTOM_STORE
                : store
            }
            onChange={(event) =>
              handleStoreChange(event.target.value)
            }
            className="w-full rounded-xl border border-[#EADCC4] bg-white px-4 py-3 outline-none focus:border-[#2F6B3C]"
          >
            {!store && (
              <option value="">
                Select store
              </option>
            )}

            {recentStores.length > 0 && (
              <optgroup label="Recently Used">
                {recentStores.map((storeName) => (
                  <option
                    key={`recent-${storeName}`}
                    value={storeName}
                  >
                    {storeName}
                  </option>
                ))}
              </optgroup>
            )}

            {customStores.length > 0 && (
              <optgroup label="My Stores">
                {customStores.map((storeName) => (
                  <option
                    key={`custom-${storeName}`}
                    value={storeName}
                  >
                    {storeName}
                  </option>
                ))}
              </optgroup>
            )}

            <optgroup label={`Suggested in ${country}`}>
              {regionalStores.map((storeName) => (
                <option
                  key={`regional-${storeName}`}
                  value={storeName}
                >
                  {storeName}
                </option>
              ))}
            </optgroup>

            <option value={ADD_CUSTOM_STORE}>
              + Add another store
            </option>
          </select>

          {isCustomStoreOpen && (
            <div className="mt-3 rounded-xl border border-[#EADCC4] bg-[#FFF8EC] p-3">
              <label className="mb-2 block text-sm font-medium text-[#5A4032]">
                Custom Store Name
              </label>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={customStore}
                  onChange={(event) =>
                    setCustomStore(event.target.value)
                  }
                  placeholder="Enter store name"
                  className="min-w-0 flex-1 rounded-xl border border-[#EADCC4] bg-white px-4 py-3 outline-none focus:border-[#2F6B3C]"
                />

                <button
                  type="button"
                  onClick={handleAddCustomStore}
                  className="rounded-xl bg-[#2F6B3C] px-4 py-3 font-semibold text-white"
                >
                  Add Store
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#5A4032]">
            Bill Amount
          </label>

          <div className="flex overflow-hidden rounded-xl border border-[#EADCC4] bg-white focus-within:border-[#2F6B3C]">
            <div className="flex items-center bg-[#FFF8EC] px-4 font-semibold text-[#5A4032]">
              {currency}
            </div>

            <input
              type="number"
              min="0"
              step="0.01"
              value={billAmount}
              onChange={(event) =>
                setBillAmount(event.target.value)
              }
              placeholder="0.00"
              className="min-w-0 flex-1 px-4 py-3 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#5A4032]">
            Notes
          </label>

          <textarea
            rows={3}
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            placeholder="Weekly grocery, monthly stock-up..."
            className="w-full rounded-xl border border-[#EADCC4] px-4 py-3 outline-none focus:border-[#2F6B3C]"
          />
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="flex gap-3 border-t border-[#F4E8D0] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 flex-1 rounded-xl border border-[#EADCC4] bg-white px-4 font-semibold text-[#5A4032]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleComplete}
            className="min-h-12 flex-1 rounded-xl bg-[#2F6B3C] px-4 font-semibold text-white"
          >
            Complete
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}