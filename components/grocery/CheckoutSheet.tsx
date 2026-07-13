"use client";

import { useEffect, useState } from "react";

import BottomSheet from "../ui/BottomSheet";

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

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function CheckoutSheet({
  isOpen,
  onClose,
  currency,
  purchasedCount,
  remainingCount,
  initialStore = "Lulu Hypermarket",
  onComplete,
}: CheckoutSheetProps) {
  const [shoppingDate, setShoppingDate] = useState(getTodayDate());
  const [store, setStore] = useState(initialStore);
  const [billAmount, setBillAmount] = useState("");
  const [notes, setNotes] = useState("Weekly Grocery");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setShoppingDate(getTodayDate());
    setStore(initialStore);
    setBillAmount("");
    setNotes("Weekly Grocery");
    setErrorMessage("");
  }, [isOpen, initialStore]);

  function handleComplete() {
    const amount = Number(billAmount);

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

    if (!amount || amount <= 0) {
      setErrorMessage("Please enter a valid bill amount.");
      return;
    }

    setErrorMessage("");

    onComplete({
      date: shoppingDate,
      store,
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
            <p className="text-sm text-green-700">Purchased</p>
            <p className="mt-1 text-3xl font-bold text-green-800">
              {purchasedCount}
            </p>
          </div>

          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-700">Remaining</p>
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
            onChange={(event) => setShoppingDate(event.target.value)}
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
              value={billAmount}
              onChange={(event) => setBillAmount(event.target.value)}
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
            onChange={(event) => setNotes(event.target.value)}
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