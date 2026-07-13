"use client";

import { useEffect, useState } from "react";

import BottomSheet from "../ui/BottomSheet";
import { GroceryTransaction } from "../../types/budget";

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

const stores = [
  "Lulu Hypermarket",
  "Carrefour",
  "Union Coop",
  "Spinneys",
  "Waitrose",
  "Choithrams",
  "Nesto",
  "Viva",
  "Other",
];

export default function EditTransactionSheet({
  isOpen,
  transaction,
  currency,
  onClose,
  onSave,
}: EditTransactionSheetProps) {
  const [date, setDate] = useState("");
  const [store, setStore] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen || !transaction) return;

    setDate(transaction.date);
    setStore(transaction.store || "Lulu Hypermarket");
    setAmount(String(transaction.amount));
    setDescription(
      transaction.description || "Grocery Shopping"
    );
    setNotes(transaction.notes || "");
    setErrorMessage("");
  }, [isOpen, transaction]);

  function handleSave() {
    const numericAmount = Number(amount);

    if (!date) {
      setErrorMessage("Please select the shopping date.");
      return;
    }

    if (!store.trim()) {
      setErrorMessage("Please select a store.");
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

    setErrorMessage("");

    onSave({
      date,
      store,
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
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-xl border border-[#EADCC4] bg-white px-4 py-3 outline-none focus:border-[#2F6B3C]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#5A4032]">
            Store
          </label>

          <select
            value={store}
            onChange={(event) => setStore(event.target.value)}
            className="w-full rounded-xl border border-[#EADCC4] bg-white px-4 py-3 outline-none focus:border-[#2F6B3C]"
          >
            {stores.map((storeName) => (
              <option key={storeName} value={storeName}>
                {storeName}
              </option>
            ))}
          </select>
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
              onChange={(event) => setAmount(event.target.value)}
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
            onChange={(event) => setNotes(event.target.value)}
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