"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import BottomSheet from "../ui/BottomSheet";
import {
  currencies,
  CurrencyOption,
} from "../../data/currencies";

type CurrencyPickerProps = {
  value: string;
  onChange: (currencyCode: string) => void;
};

export default function CurrencyPicker({
  value,
  onChange,
}: CurrencyPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedCurrency = useMemo(
    () =>
      currencies.find(
        (currency) => currency.code === value
      ),
    [value]
  );

  const filteredCurrencies = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      return currencies;
    }

    return currencies.filter((currency) => {
      return (
        currency.code
          .toLowerCase()
          .includes(normalizedSearch) ||
        currency.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        currency.symbol
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [searchTerm]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  function handleSelectCurrency(
    currency: CurrencyOption
  ) {
    onChange(currency.code);
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-between gap-4 rounded-xl border border-[#EADCC4] bg-white px-4 py-3 text-left outline-none transition hover:border-[#2F6B3C]"
      >
        <div className="min-w-0">
          {selectedCurrency ? (
            <>
              <p className="font-semibold text-[#5A4032]">
                {selectedCurrency.code} —{" "}
                {selectedCurrency.name}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Currency symbol:{" "}
                {selectedCurrency.symbol}
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-[#5A4032]">
                Select currency
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Search by currency code, name, or symbol
              </p>
            </>
          )}
        </div>

        <ChevronDown
          size={20}
          className="shrink-0 text-[#5A4032]"
        />
      </button>

      <BottomSheet
        isOpen={isOpen}
        title="Select Currency"
        onClose={() => setIsOpen(false)}
      >
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search AED, Rupee, Dollar, ₹..."
              autoFocus
              className="w-full rounded-xl border border-[#EADCC4] bg-white py-3 pl-11 pr-4 outline-none focus:border-[#2F6B3C]"
            />
          </div>

          {/* Result Count */}
          <p className="text-sm text-gray-500">
            {filteredCurrencies.length}{" "}
            {filteredCurrencies.length === 1
              ? "currency"
              : "currencies"}{" "}
            found
          </p>

          {/* Currency Results */}
          {filteredCurrencies.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#EADCC4] bg-[#FFF8EC] px-4 py-8 text-center">
              <p className="font-semibold text-[#5A4032]">
                No currency found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Try searching by currency code or name.
              </p>
            </div>
          ) : (
            <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
              {filteredCurrencies.map(
                (currency) => {
                  const isSelected =
                    currency.code === value;

                  return (
                    <button
                      key={currency.code}
                      type="button"
                      onClick={() =>
                        handleSelectCurrency(
                          currency
                        )
                      }
                      className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition ${
                        isSelected
                          ? "border-[#2F6B3C] bg-green-50"
                          : "border-[#F4E8D0] bg-white hover:bg-[#FFF8EC]"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl bg-[#FFF8EC] text-base font-bold text-[#2F6B3C]">
                          {currency.symbol}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-[#5A4032]">
                            {currency.code}
                          </p>

                          <p className="mt-0.5 truncate text-sm text-gray-500">
                            {currency.name}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2F6B3C] text-white">
                          <Check size={17} />
                        </div>
                      )}
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>
      </BottomSheet>
    </>
  );
}