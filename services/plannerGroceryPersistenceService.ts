import {
  ShoppingItem,
} from "../types/shopping";

import {
  GroceryRequirementSource,
} from "../types/groceryRequirementSource";

import {
  PlannerGroceryReconciliation,
} from "../lib/planner/plannerGroceryReconciler";

import {
  deleteCloudGroceryItem,
  saveCloudGroceryItem,
} from "./groceryService";

import {
  deleteCloudGroceryRequirementSource,
  saveCloudGroceryRequirementSource,
} from "./groceryRequirementSourceService";

import {
  normalizeGroceryUnit,
  convertGroceryQuantityToNormalizedUnit,
} from "../lib/grocery/groceryIdentity";


/* ============================================================
   Result
============================================================ */

export interface ApplyPlannerGroceryResult {
  savedItems:
    ShoppingItem[];

  deletedGroceryItemIds:
    string[];

  savedSources:
    GroceryRequirementSource[];

  deletedSourceIds:
    string[];
}


/* ============================================================
   Quantity Helpers
============================================================ */

function parseShoppingQuantity(
  value: string
): {
  quantity: number;
  unit: string;
} {
  const parts =
    value
      .trim()
      .split(
        /\s+/
      );

  const quantity =
    Number(
      parts[0]
    );

  const rawUnit =
    parts
      .slice(1)
      .join(" ")
      .trim() ||
    "pcs";

  if (
    !Number.isFinite(
      quantity
    )
  ) {
    throw new Error(
      `Unable to read Grocery quantity: ${value}`
    );
  }

  return {
    quantity:
      convertGroceryQuantityToNormalizedUnit(
        quantity,
        rawUnit
      ),

    unit:
      normalizeGroceryUnit(
        rawUnit
      ),
  };
}


function formatQuantity(
  quantity: number,
  unit: string
) {
  return `${quantity} ${unit}`;
}


/* ============================================================
   Apply Planner Grocery Reconciliation

   IMPORTANT:

   This function only applies:

   add
   reduce
   remove

   review is NEVER applied automatically.

   unchanged requires no write.
============================================================ */

export async function applyPlannerGroceryReconciliation(
  reconciliation:
    PlannerGroceryReconciliation,

  sourceName: string
): Promise<ApplyPlannerGroceryResult> {
  if (
    reconciliation.reviewCount >
    0
  ) {
    throw new Error(
      "Planner Grocery changes contain items that require review. Resolve them before updating Grocery."
    );
  }

  const savedItems:
    ShoppingItem[] = [];

  const deletedGroceryItemIds:
    string[] = [];

  const savedSources:
    GroceryRequirementSource[] = [];

  const deletedSourceIds:
    string[] = [];


  /*
   * Sequential processing is deliberate.
   *
   * Grocery identity/merging and source
   * allocations must stay synchronized.
   */
  for (
    const item of
    reconciliation.items
  ) {
    if (
      item.action ===
      "review" ||
      item.action ===
      "unchanged"
    ) {
      continue;
    }


    /* ========================================================
       ADD
    ======================================================== */

    if (
      item.action ===
      "add"
    ) {
      let itemToSave:
        ShoppingItem;

      /*
       * Existing Grocery row:
       * increase that row by only the
       * Planner adjustment.
       */
      if (
        item.groceryItem
      ) {
        const existing =
          parseShoppingQuantity(
            item.groceryItem
              .quantity
          );

        const requiredUnit =
          normalizeGroceryUnit(
            item.unit
          );

        if (
          existing.unit !==
          requiredUnit
        ) {
          throw new Error(
            `${item.ingredientName} Grocery unit changed before Planner update. Please review the item.`
          );
        }

        itemToSave = {
          ...item.groceryItem,

          quantity:
            formatQuantity(
              existing.quantity +
                item.adjustmentQuantity,
              requiredUnit
            ),

          purchased:
            false,
        };
      } else {
        /*
         * No Grocery row yet.
         */
        itemToSave = {
          id:
            crypto.randomUUID(),

          name:
            item.ingredientName,

          category:
            item.demand
              ?.category ||
            "Grocery",

          quantity:
            formatQuantity(
              item.adjustmentQuantity,
              normalizeGroceryUnit(
                item.unit
              )
            ),

          purchased:
            false,
        };
      }

      /*
       * Save Grocery FIRST because the
       * service may merge into an existing
       * row and return a different final ID.
       */
      const savedItem =
        await saveCloudGroceryItem(
          itemToSave
        );

      savedItems.push(
        savedItem
      );

      /*
       * Planner source stores the TOTAL
       * amount currently contributed by
       * this Planner week.
       */
      const source:
        GroceryRequirementSource = {
        id:
          item.source?.id ??
          crypto.randomUUID(),

        groceryItemId:
          savedItem.id,

        sourceType:
          "planner",

        sourceId:
          reconciliation.weeklyPlanId,

        sourceName,

        ingredientName:
          item.ingredientName,

        quantity:
          item.requiredQuantity,

        unit:
          normalizeGroceryUnit(
            item.unit
          ),
      };

      const savedSource =
        await saveCloudGroceryRequirementSource(
          source
        );

      savedSources.push(
        savedSource
      );

      continue;
    }


    /* ========================================================
       REDUCE
    ======================================================== */

    if (
      item.action ===
      "reduce"
    ) {
      if (
        !item.groceryItem ||
        !item.source
      ) {
        throw new Error(
          `${item.ingredientName} cannot be reduced because its Planner Grocery allocation is incomplete.`
        );
      }

      const existing =
        parseShoppingQuantity(
          item.groceryItem
            .quantity
        );

      const requiredUnit =
        normalizeGroceryUnit(
          item.unit
        );

      if (
        existing.unit !==
        requiredUnit
      ) {
        throw new Error(
          `${item.ingredientName} Grocery unit changed before Planner reduction.`
        );
      }

      const newGroceryQuantity =
        existing.quantity -
        item.adjustmentQuantity;

      if (
        newGroceryQuantity <= 0
      ) {
        throw new Error(
          `${item.ingredientName} reduction would remove the entire Grocery row unexpectedly. Use the remove action instead.`
        );
      }

      const updatedItem:
        ShoppingItem = {
        ...item.groceryItem,

        quantity:
          formatQuantity(
            newGroceryQuantity,
            requiredUnit
          ),
      };

      const savedItem =
        await saveCloudGroceryItem(
          updatedItem
        );

      savedItems.push(
        savedItem
      );

      const savedSource =
        await saveCloudGroceryRequirementSource({
          ...item.source,

          groceryItemId:
            savedItem.id,

          quantity:
            item.requiredQuantity,

          unit:
            requiredUnit,

          sourceName,
        });

      savedSources.push(
        savedSource
      );

      continue;
    }


    /* ========================================================
       REMOVE

       Remove ONLY this Planner week's
       allocation from Grocery.

       Any remaining Grocery quantity can
       belong to Recipe/manual sources.
    ======================================================== */

    if (
      item.action ===
      "remove"
    ) {
      if (
        !item.groceryItem ||
        !item.source
      ) {
        throw new Error(
          `${item.ingredientName} cannot be removed because its Planner allocation is incomplete.`
        );
      }

      const existing =
        parseShoppingQuantity(
          item.groceryItem
            .quantity
        );

      const sourceQuantity =
        convertGroceryQuantityToNormalizedUnit(
          Number(
            item.source.quantity
          ),
          item.source.unit
        );

      const sourceUnit =
        normalizeGroceryUnit(
          item.source.unit
        );

      if (
        existing.unit !==
        sourceUnit
      ) {
        throw new Error(
          `${item.ingredientName} Grocery unit changed before Planner removal.`
        );
      }

      const remainingQuantity =
        existing.quantity -
        sourceQuantity;

      if (
        remainingQuantity <
        0
      ) {
        throw new Error(
          `${item.ingredientName} Grocery quantity is smaller than the Planner allocation. Review the Grocery item before removing it.`
        );
      }

      /*
       * Delete Planner source first.
       */
      await deleteCloudGroceryRequirementSource(
        item.source.id
      );

      deletedSourceIds.push(
        item.source.id
      );

      /*
       * No quantity remains in Grocery.
       */
      if (
        remainingQuantity ===
        0
      ) {
        await deleteCloudGroceryItem(
          item.groceryItem.id
        );

        deletedGroceryItemIds.push(
          item.groceryItem.id
        );
      } else {
        /*
         * Something else still owns part
         * of this Grocery quantity.
         */
        const updatedItem:
          ShoppingItem = {
          ...item.groceryItem,

          quantity:
            formatQuantity(
              remainingQuantity,
              sourceUnit
            ),
        };

        const savedItem =
          await saveCloudGroceryItem(
            updatedItem
          );

        savedItems.push(
          savedItem
        );
      }
    }
  }


  return {
    savedItems,

    deletedGroceryItemIds,

    savedSources,

    deletedSourceIds,
  };
}