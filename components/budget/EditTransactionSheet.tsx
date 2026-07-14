"use client";

import { useEffect, useMemo, useState } from "react";

import BottomSheet from "../ui/BottomSheet";
import { GroceryTransaction } from "../../types/budget";

import { getRegionalStores } from "../../data/regionalStores";
import { loadPreferences } from "../../lib/preferencesStorage";

import {
  
  loadCustomStores,
  loadRecentStores,
  saveCustomStore,
  saveRecentStore,
} from "../../lib/storePreferences";

type EditTransactionData = {
  date: string;
  store: string;
  amount: number;
  description: string;
  notes: string;
};

type EditTransactionSheetProps = {
  isOpen: boolean;
  transaction: GroceryTransaction | null;
  currency: string;
  onClose: () => void;
  onSave: (data: EditTransactionData) => void;
};

const ADD_CUSTOM_STORE = "__add_custom_store__";

export default function EditTransactionSheet({
  isOpen,
  transaction,
  currency,
  onClose,
  onSave,
}: EditTransactionSheetProps) {
  const [date, setDate] = useState("");
  const [country, setCountry] =
    useState("United Arab Emirates");

  const [store, setStore] = useState("");
  const [customStore, setCustomStore] = useState("");
  const [isCustomStoreOpen, setIsCustomStoreOpen] =
    useState(false);

  const [recentStores, setRecentStores] = useState<string[]>([]);
  const [customStores, setCustomStores] = useState<string[]>([]);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen || !transaction) return;

    const preferences = loadPreferences();

    setCountry(preferences.country);
    setRecentStores(loadRecentStores());
    setCustomStores(loadCustomStores());

    setDate(transaction.date);
    setStore(transaction.store || "");
    setAmount(String(transaction.amount));
    setDescription(
      transaction.description || "Grocery Shopping"
    );
    setNotes(transaction.notes || "");

    setCustomStore("");
    setIsCustomStoreOpen(false);
    setErrorMessage("");
  }, [isOpen, transaction]);

  const regionalStores = useMemo(
    () => getRegionalStores(country),
    [country]
  );

  

  function handleStoreChange(value: string) {
    if (value === ADD_CUSTOM_STORE) {
      setIsCustomStoreOpen(true);
      setCustomStore("");
      setStore("");
      setErrorMessage("");
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

  function handleSave() {
    const numericAmount = Number(amount);

    const selectedStore = isCustomStoreOpen
      ? customStore.trim()
      : store.trim();

    if (!date) {
      setErrorMessage("Please select the shopping date.");
      return;
    }

    if (!selectedStore) {
      setErrorMessage(
        "Please select or add a grocery store."
      );
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      setErrorMessage("Please enter a valid bill amount.");
      return;
    }

    if (!description.trim()) {
      setErrorMessage("Please enter a description.");
      return;
    }

    if (isCustomStoreOpen) {
      saveCustomStore(selectedStore);
    } else {
      saveRecentStore(selectedStore);
    }

    setErrorMessage("");

    onSave({
      date,
      store: selectedStore,
      amount: numericAmount,
      description: description.trim(),
      notes: notes.trim(),
    });
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      title="Edit Grocery Expense"
      onClose={onClose}
    >
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#5A4032]">
            Shopping Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
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
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              placeholder="0.00"
              className="min-w-0 flex-1 px-4 py-3 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#5A4032]">
            Description
          </label>

          <input
            type="text"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Weekly Grocery"
            className="w-full rounded-xl border border-[#EADCC4] px-4 py-3 outline-none focus:border-[#2F6B3C]"
          />
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
            placeholder="Optional notes"
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
            onClick={handleSave}
            className="min-h-12 flex-1 rounded-xl bg-[#2F6B3C] px-4 font-semibold text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}