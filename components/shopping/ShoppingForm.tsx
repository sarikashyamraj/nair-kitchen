"use client";

import { useEffect, useState } from "react";
import { ShoppingItem } from "../../types/shopping";
import { INGREDIENT_CATEGORIES } from "../../constants/categories";
import { UNITS } from "../../constants/units";
import { useToast } from "../../context/ToastContext";
import { suggestCategory } from "../../services/categorySuggestion";

interface ShoppingFormProps {
  item: ShoppingItem | null;
  onClose: () => void;
  shoppingItems: ShoppingItem[];
  setShoppingItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
}

export default function ShoppingForm({
  item,
  onClose,
  shoppingItems,
  setShoppingItems,
}: ShoppingFormProps) {
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Other");
  const [quantityValue, setQuantityValue] = useState("");
  const [unit, setUnit] = useState("kg");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category);

      const parts = item.quantity.trim().split(" ");
      setQuantityValue(parts[0] || "");
      setUnit(parts.slice(1).join(" ") || "kg");
    }
  }, [item]);

  const handleNameChange = (value: string) => {
    setName(value);

    const suggested = suggestCategory(value);

    if (suggested) {
      setCategory(suggested);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      showToast({
        type: "warning",
        message: "Please enter an item name.",
      });
      return;
    }

    if (!quantityValue.trim()) {
      showToast({
        type: "warning",
        message: "Please enter quantity.",
      });
      return;
    }

    const finalQuantity = `${quantityValue} ${unit}`;

    const duplicate = shoppingItems.find(
      (shoppingItem) =>
        shoppingItem.id !== item?.id &&
        shoppingItem.name.trim().toLowerCase() ===
          name.trim().toLowerCase()
    );

    if (duplicate) {
      setShoppingItems(
        shoppingItems.map((shoppingItem) =>
          shoppingItem.id === duplicate.id
            ? {
                ...shoppingItem,
                quantity: finalQuantity,
                category,
              }
            : shoppingItem
        )
      );

      showToast({
        type: "warning",
        message: `"${name}" already exists. Existing item has been updated.`,
      });

      onClose();
      return;
    }

    const newItem: ShoppingItem = {
      id: item ? item.id : Date.now().toString(),
      name,
      category,
      quantity: finalQuantity,
      purchased: item ? item.purchased : false,
    };

    if (item) {
      setShoppingItems(
        shoppingItems.map((shoppingItem) =>
          shoppingItem.id === item.id ? newItem : shoppingItem
        )
      );

      showToast({
        type: "success",
        message: "Shopping item updated successfully.",
      });
    } else {
      setShoppingItems([...shoppingItems, newItem]);

      showToast({
        type: "success",
        message: "Shopping item added successfully.",
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-5">
        <h2 className="text-2xl font-bold">
          {item ? "Edit Item" : "Add Shopping Item"}
        </h2>

        <div>
          <label className="block mb-1 font-medium">Item Name</label>
          <input
            className="border rounded-lg w-full px-4 py-2"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Milk"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            className="border rounded-lg w-full px-4 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {INGREDIENT_CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Quantity</label>

          <div className="grid grid-cols-2 gap-3">
            <input
              className="border rounded-lg w-full px-4 py-2"
              value={quantityValue}
              onChange={(e) => setQuantityValue(e.target.value)}
              placeholder="2"
              type="number"
            />

            <select
              className="border rounded-lg w-full px-4 py-2"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              {UNITS.map((unit) => (
                <option key={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button onClick={onClose} className="px-5 py-2 rounded-lg border">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}