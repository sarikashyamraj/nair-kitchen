import { PantryItem } from "../../types/pantry";

export type PantryStockStatus =
  | "in_stock"
  | "low_stock"
  | "out_of_stock";

export function getPantryStockStatus(
  item: PantryItem
): PantryStockStatus {
  const quantity = Number(item.quantity);
  const minimum = Number(item.minQuantity);

  if (!Number.isFinite(quantity)) {
    throw new Error("Invalid pantry quantity.");
  }

  if (!Number.isFinite(minimum)) {
    throw new Error("Invalid pantry minimum quantity.");
  }

  if (quantity <= 0) {
    return "out_of_stock";
  }

  if (quantity <= minimum) {
    return "low_stock";
  }

  return "in_stock";
}

export function isOutOfStock(
  item: PantryItem
) {
  return (
    getPantryStockStatus(item) ===
    "out_of_stock"
  );
}

export function isLowStock(
  item: PantryItem
) {
  return (
    getPantryStockStatus(item) ===
    "low_stock"
  );
}

export function isInStock(
  item: PantryItem
) {
  return (
    getPantryStockStatus(item) ===
    "in_stock"
  );
}

export function getPantryStatusLabel(
  status: PantryStockStatus
) {
  switch (status) {
    case "out_of_stock":
      return "Out of Stock";

    case "low_stock":
      return "Running Low";

    default:
      return "In Stock";
  }
}

export function getPantryStatusClasses(
  status: PantryStockStatus
) {
  switch (status) {
    case "out_of_stock":
      return {
        badge:
          "bg-red-100 text-red-700",
      };

    case "low_stock":
      return {
        badge:
          "bg-yellow-100 text-yellow-700",
      };

    default:
      return {
        badge:
          "bg-green-100 text-green-700",
      };
  }
}