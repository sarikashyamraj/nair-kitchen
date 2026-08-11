import { PantryItem } from "../../types/pantry";
import { getPantryStockStatus } from "./pantryStatus";

export type PantrySortOption =
  | "attention"
  | "name_asc"
  | "name_desc"
  | "quantity_asc"
  | "quantity_desc";

export type PantryFilterOptions = {
  searchTerm: string;
  category: string;
  sortOption?: PantrySortOption;
};

function normalizeText(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase();
}

function getAttentionPriority(
  item: PantryItem
) {
  const status =
    getPantryStockStatus(item);

  if (status === "out_of_stock") {
    return 0;
  }

  if (status === "low_stock") {
    return 1;
  }

  return 2;
}

export function filterPantryItems(
  items: PantryItem[],
  options: PantryFilterOptions
): PantryItem[] {
  const normalizedSearch =
    normalizeText(options.searchTerm);

  const filteredItems = items.filter(
    (item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        normalizeText(item.name).includes(
          normalizedSearch
        );

      const matchesCategory =
        options.category === "All" ||
        item.category ===
          options.category;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  const sortOption =
    options.sortOption ??
    "attention";

  return [...filteredItems].sort(
    (firstItem, secondItem) => {
      switch (sortOption) {
        case "name_asc":
          return firstItem.name.localeCompare(
            secondItem.name
          );

        case "name_desc":
          return secondItem.name.localeCompare(
            firstItem.name
          );

        case "quantity_asc":
          return (
            firstItem.quantity -
            secondItem.quantity
          );

        case "quantity_desc":
          return (
            secondItem.quantity -
            firstItem.quantity
          );

        case "attention":
        default: {
          const priorityDifference =
            getAttentionPriority(
              firstItem
            ) -
            getAttentionPriority(
              secondItem
            );

          if (
            priorityDifference !== 0
          ) {
            return priorityDifference;
          }

          return firstItem.name.localeCompare(
            secondItem.name
          );
        }
      }
    }
  );
}

export function findMatchingPantryItem(
  items: PantryItem[],
  candidate: PantryItem
): PantryItem | undefined {
  const normalizedCandidateName =
    normalizeText(candidate.name);

  const normalizedCandidateUnit =
    normalizeText(candidate.unit);

  const normalizedCandidateCategory =
    normalizeText(candidate.category);

  return items.find((item) => {
    return (
      normalizeText(item.name) ===
        normalizedCandidateName &&
      normalizeText(item.unit) ===
        normalizedCandidateUnit &&
      normalizeText(item.category) ===
        normalizedCandidateCategory
    );
  });
}