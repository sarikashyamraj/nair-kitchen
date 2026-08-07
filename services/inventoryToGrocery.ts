import { PantryItem } from "../types/pantry";
import { ShoppingItem } from "../types/shopping";

type ParsedShoppingQuantity = {
  quantity: number;
  unit: string;
};

export type InventoryToGroceryResult = {
  shopping: ShoppingItem[];
  itemsToSave: ShoppingItem[];
  addedCount: number;
  updatedCount: number;
  skippedCount: number;
};

function normalizeName(
  value: string
) {
  return value
    .trim()
    .toLowerCase();
}

function normalizeUnit(
  value: string
) {
  return value
    .trim()
    .toLowerCase();
}

function parseShoppingQuantity(
  quantityText: string
): ParsedShoppingQuantity | null {
  const trimmed =
    quantityText.trim();

  const parts =
    trimmed.split(/\s+/);

  const numericValue =
    Number(parts[0]);

  if (
    !Number.isFinite(
      numericValue
    )
  ) {
    return null;
  }

  const unit =
    parts
      .slice(1)
      .join(" ")
      .trim() ||
    "pcs";

  return {
    quantity:
      numericValue,

    unit,
  };
}

function formatQuantity(
  quantity: number,
  unit: string
) {
  const roundedQuantity =
    Number(
      quantity.toFixed(2)
    );

  return `${roundedQuantity} ${unit}`;
}

export function getInventoryRestockQuantity(
  item: PantryItem
) {
  const currentQuantity =
    Number(item.quantity);

  const minimumQuantity =
    Number(item.minQuantity);

  if (
    !Number.isFinite(
      currentQuantity
    ) ||
    !Number.isFinite(
      minimumQuantity
    )
  ) {
    return 0;
  }

  if (
    minimumQuantity <= 0
  ) {
    return 0;
  }

  if (
    currentQuantity >
    minimumQuantity
  ) {
    return 0;
  }

  return Math.max(
    minimumQuantity -
      currentQuantity,
    0
  );
}

export function inventoryItemToGroceryItem(
  item: PantryItem
): ShoppingItem | null {
  const neededQuantity =
    getInventoryRestockQuantity(
      item
    );

  if (
    neededQuantity <= 0
  ) {
    return null;
  }

  return {
    id:
      crypto.randomUUID(),

    name:
      item.name.trim(),

    category:
      item.category,

    quantity:
      formatQuantity(
        neededQuantity,
        item.unit
      ),

    purchased:
      false,
  };
}

export function mergeInventoryItemsIntoGrocery(
  inventoryItems: PantryItem[],
  currentShopping: ShoppingItem[]
): InventoryToGroceryResult {
  const mergedShopping =
    currentShopping.map(
      (item) => ({
        ...item,
      })
    );

  const itemsToSave:
    ShoppingItem[] = [];

  let addedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  inventoryItems.forEach(
    (inventoryItem) => {
      const generatedItem =
        inventoryItemToGroceryItem(
          inventoryItem
        );

      if (!generatedItem) {
        skippedCount += 1;
        return;
      }

      const existingIndex =
        mergedShopping.findIndex(
          (shoppingItem) =>
            normalizeName(
              shoppingItem.name
            ) ===
            normalizeName(
              generatedItem.name
            )
        );

      /*
       * Item does not currently
       * exist in Grocery.
       */
      if (
        existingIndex < 0
      ) {
        mergedShopping.push(
          generatedItem
        );

        itemsToSave.push(
          generatedItem
        );

        addedCount += 1;

        return;
      }

      const existingItem =
        mergedShopping[
          existingIndex
        ];

      const existingQuantity =
        parseShoppingQuantity(
          existingItem.quantity
        );

      const generatedQuantity =
        parseShoppingQuantity(
          generatedItem.quantity
        );

      /*
       * If we cannot safely read
       * either quantity, don't
       * automatically alter it.
       */
      if (
        !existingQuantity ||
        !generatedQuantity
      ) {
        skippedCount += 1;
        return;
      }

      /*
       * Never add unlike units
       * together.
       *
       * Example:
       * 1 kg + 2 pcs
       * would be invalid.
       */
      if (
  normalizeUnit(
    existingQuantity.unit
  ) !==
  normalizeUnit(
    generatedQuantity.unit
  )
) {
  skippedCount += 1;
  return;
}

/*
 * Grocery already contains enough
 * of this item to cover the current
 * Inventory shortage.
 *
 * Do not increase it again.
 */
if (
  existingQuantity.quantity >=
  generatedQuantity.quantity
) {
  skippedCount += 1;
  return;
}

const updatedItem:
  ShoppingItem = {
  ...existingItem,

  category:
    generatedItem.category,

  quantity:
    formatQuantity(
      Math.max(
        existingQuantity.quantity,
        generatedQuantity.quantity
      ),
      existingQuantity.unit
    ),

  purchased:
    false,
};

mergedShopping[
  existingIndex
] = updatedItem;

itemsToSave.push(
  updatedItem
);

updatedCount += 1;

      
    }
  );

  return {
    shopping:
      mergedShopping,

    itemsToSave,

    addedCount,

    updatedCount,

    skippedCount,
  };
}