"use client";

import { useState } from "react";

import { PantryItem } from "../../types/pantry";
import { UNITS } from "../../constants/units";
import { useToast } from "../../context/ToastContext";
import { suggestCategory } from "../../services/categorySuggestion";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

import InventoryCategorySelect from "../inventory/InventoryCategorySelect";

type AddIngredientFormProps = {
  itemToEdit?: PantryItem | null;

  initialCategory?: string | null;

  onClose: () => void;

  onSave: (
    item: PantryItem
  ) => Promise<void>;
};

export default function AddIngredientForm({
  itemToEdit,
  initialCategory,
  onClose,
  onSave,
}: AddIngredientFormProps) {
  const { showToast } =
    useToast();

  const [name, setName] =
    useState(
      itemToEdit?.name ?? ""
    );

  const [
    quantity,
    setQuantity,
  ] = useState(
    itemToEdit
      ? String(
          itemToEdit.quantity
        )
      : ""
  );

  const [unit, setUnit] =
    useState(
      itemToEdit?.unit ?? "kg"
    );

  const [
    category,
    setCategory,
  ] = useState(
    itemToEdit?.category ??
      initialCategory ??
      "Vegetables"
  );

  const [
    minQuantity,
    setMinQuantity,
  ] = useState(
    itemToEdit
      ? String(
          itemToEdit.minQuantity
        )
      : "1"
  );

  const [notes, setNotes] =
    useState(
      itemToEdit?.notes ?? ""
    );

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  function handleNameChange(
    value: string
  ) {
    setName(value);

    const suggested =
      suggestCategory(value);

    if (suggested) {
      setCategory(
        suggested
      );
    }
  }

  async function handleSave() {
    if (isSaving) {
      return;
    }

    const trimmedName =
      name.trim();

    const parsedQuantity =
      Number(quantity);

    const parsedMinimum =
      Number(minQuantity);

    if (!trimmedName) {
      showToast({
        type: "warning",
        message:
          "Please enter an item name.",
      });

      return;
    }

    if (
      quantity.trim() === "" ||
      !Number.isFinite(
        parsedQuantity
      ) ||
      parsedQuantity < 0
    ) {
      showToast({
        type: "warning",
        message:
          "Quantity must be zero or greater.",
      });

      return;
    }

    if (
      minQuantity.trim() ===
        "" ||
      !Number.isFinite(
        parsedMinimum
      ) ||
      parsedMinimum < 0
    ) {
      showToast({
        type: "warning",
        message:
          "Minimum quantity must be zero or greater.",
      });

      return;
    }

    if (!unit.trim()) {
      showToast({
        type: "warning",
        message:
          "Please select a unit.",
      });

      return;
    }

    if (!category.trim()) {
      showToast({
        type: "warning",
        message:
          "Please select a category.",
      });

      return;
    }

    const pantryItem:
      PantryItem = {
      id:
        itemToEdit?.id ??
        crypto.randomUUID(),

      name:
        trimmedName,

      quantity:
        parsedQuantity,

      unit,

      category,

      minQuantity:
        parsedMinimum,

      notes:
        notes.trim(),
    };

    try {
      setIsSaving(true);

      await onSave(
        pantryItem
      );
    } catch {
      // Parent handles save errors.
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6">
      <div className="flex max-h-[calc(100dvh-1rem)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl">
        {/* Header */}
        <div className="shrink-0 border-b border-[#F4E8D0] bg-white px-5 py-4 sm:px-6">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-200 sm:hidden" />

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D89B3C]">
                Home Inventory
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#2F6B3C] sm:text-2xl">
                {itemToEdit
                  ? "Edit Inventory Item"
                  : "Add Inventory Item"}
              </h2>

              <p className="mt-1 text-sm leading-5 text-gray-500">
                Track current stock and set the level that should trigger a low-stock alert.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={
                isSaving
              }
              aria-label="Close inventory item form"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#EADCC4] text-lg text-gray-500 transition hover:bg-[#FAF8F3] disabled:cursor-not-allowed disabled:opacity-50"
            >
              ×
            </button>
          </div>
        </div>

        {/* Scrollable Form */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="space-y-5">
            {/* Item Details */}
            <section>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                Item Details
              </p>

              <div className="space-y-4">
                <Input
                  label="Item Name"
                  value={name}
                  onChange={(
                    event
                  ) =>
                    handleNameChange(
                      event.target
                        .value
                    )
                  }
                  placeholder="Milk or Dish Soap"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Current Quantity"
                    value={
                      quantity
                    }
                    onChange={(
                      event
                    ) =>
                      setQuantity(
                        event.target
                          .value
                      )
                    }
                    placeholder="2"
                    type="number"
                    min="0"
                  />

                  <Select
                    label="Unit"
                    value={
                      unit
                    }
                    onChange={(
                      event
                    ) =>
                      setUnit(
                        event.target
                          .value
                      )
                    }
                    options={[
                      ...UNITS,
                    ]}
                  />
                </div>
              </div>
            </section>

            {/* Smart Stock Settings */}
            <section className="rounded-2xl border border-[#F4E8D0] bg-[#FAF8F3] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                Smart Stock Settings
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Kitchen Brain will flag this item when the available quantity reaches the minimum level.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Input
                  label="Minimum Quantity"
                  value={
                    minQuantity
                  }
                  onChange={(
                    event
                  ) =>
                    setMinQuantity(
                      event.target
                        .value
                    )
                  }
                  placeholder="1"
                  type="number"
                  min="0"
                />

                <InventoryCategorySelect
                  value={
                    category
                  }
                  onChange={
                    setCategory
                  }
                />
              </div>
            </section>

            {/* Notes */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#5A4032]">
                Notes

                <span className="ml-1 font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <textarea
                value={
                  notes
                }
                onChange={(
                  event
                ) =>
                  setNotes(
                    event.target
                      .value
                  )
                }
                className="w-full resize-none rounded-xl border border-[#EADCC4] bg-white px-4 py-3 text-[#5A4032] shadow-sm focus:border-[#2F6B3C] focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
                placeholder="Brand, storage notes or other useful details"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Always-visible Actions */}
        <div className="shrink-0 border-t border-[#F4E8D0] bg-white px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pb-5">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={
                onClose
              }
              disabled={
                isSaving
              }
            >
              Cancel
            </Button>

            <Button
              onClick={
                handleSave
              }
              disabled={
                isSaving
              }
            >
              {isSaving
                ? "Saving..."
                : itemToEdit
                  ? "Update Item"
                  : "Save Item"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}