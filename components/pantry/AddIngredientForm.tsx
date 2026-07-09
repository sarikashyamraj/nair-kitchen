"use client";

import { useState } from "react";
import { PantryItem } from "../../types/pantry";
import { UNITS } from "../../constants/units";
import { INGREDIENT_CATEGORIES } from "../../constants/categories";
import { useToast } from "../../context/ToastContext";
import { suggestCategory } from "../../services/categorySuggestion";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

type AddIngredientFormProps = {
  itemToEdit?: PantryItem | null;
  onClose: () => void;
  onSave: (item: PantryItem) => void;
};

export default function AddIngredientForm({
  itemToEdit,
  onClose,
  onSave,
}: AddIngredientFormProps) {
  const { showToast } = useToast();

  const [name, setName] = useState(itemToEdit?.name || "");
  const [quantity, setQuantity] = useState(
    itemToEdit?.quantity ? String(itemToEdit.quantity) : ""
  );
  const [unit, setUnit] = useState(itemToEdit?.unit || "kg");
  const [category, setCategory] = useState(itemToEdit?.category || "Vegetables");
  const [minQuantity, setMinQuantity] = useState(
    itemToEdit?.minQuantity ? String(itemToEdit.minQuantity) : ""
  );
  const [notes, setNotes] = useState(itemToEdit?.notes || "");

  function handleNameChange(value: string) {
    setName(value);

    const suggested = suggestCategory(value);

    if (suggested) {
      setCategory(suggested);
    }
  }

  function handleSave() {
    if (!name.trim() || !quantity) {
      showToast({
        type: "warning",
        message: "Please enter ingredient name and quantity.",
      });
      return;
    }

    const minQty = minQuantity ? Number(minQuantity) : 1;

    onSave({
      id: itemToEdit?.id || crypto.randomUUID(),
      name,
      quantity: Number(quantity),
      unit,
      category,
      minQuantity: minQty,
      notes,
    });

    showToast({
      type: "success",
      message: itemToEdit
        ? "Ingredient updated successfully."
        : "Ingredient added successfully.",
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#2F6B3C]">
          {itemToEdit ? "Edit Ingredient" : "Add Ingredient"}
        </h2>

        <div className="mt-6 space-y-4">
          <Input
            label="Ingredient Name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Milk"
          />

          <Input
            label="Current Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="2"
            type="number"
          />

          <Input
            label="Minimum Quantity"
            value={minQuantity}
            onChange={(e) => setMinQuantity(e.target.value)}
            placeholder="Low stock alert"
            type="number"
          />

          <Select
            label="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            options={[...UNITS]}
          />

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[...INGREDIENT_CATEGORIES]}
          />

          <div>
            <label className="block mb-2 text-sm font-medium text-[#5A4032]">
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-[#EADCC4] bg-white px-4 py-3 text-[#5A4032] shadow-sm focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/20 focus:outline-none"
              placeholder="Notes"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSave}>
            {itemToEdit ? "Update" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}