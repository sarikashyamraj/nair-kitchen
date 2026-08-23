import {
  GroceryRequirementSource,
} from "../../types/groceryRequirementSource";

import {
  ShoppingItem,
} from "../../types/shopping";

import {
  PlannerDemandAnalysis,
  PlannerIngredientDemand,
  normalizePlannerUnit,
} from "./plannerDemandAnalyzer";


/* ============================================================
   Planner Grocery Reconciliation Types
============================================================ */

export type PlannerGroceryAction =
  | "add"
  | "reduce"
  | "unchanged"
  | "remove"
  | "review";


export interface PlannerGroceryReconciliationItem {
  ingredientName: string;

  normalizedName: string;

  unit: string;

  /*
   * Current Planner shortage after
   * comparing weekly demand against
   * Home Inventory.
   */
  requiredQuantity: number;

  /*
   * Quantity THIS SAME weekly Planner
   * has already contributed to Grocery.
   */
  allocatedQuantity: number;

  /*
   * Positive quantity that must be
   * added or reduced.
   *
   * For unchanged it will be 0.
   */
  adjustmentQuantity: number;

  action:
    PlannerGroceryAction;

  groceryItem?: ShoppingItem;

  source?: GroceryRequirementSource;

  demand?: PlannerIngredientDemand;

  message: string;
}


export interface PlannerGroceryReconciliation {
  weeklyPlanId: string;

  items:
    PlannerGroceryReconciliationItem[];

  addCount: number;

  reduceCount: number;

  removeCount: number;

  unchangedCount: number;

  reviewCount: number;

  hasChanges: boolean;
}


/* ============================================================
   Text Helpers
============================================================ */

function normalizeText(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /\s+/g,
      " "
    );
}


/* ============================================================
   Grocery Quantity Parsing
============================================================ */

type ParsedGroceryQuantity = {
  quantity: number;

  unit: string;
};


function parseGroceryQuantity(
  value: string
): ParsedGroceryQuantity | null {
  const match =
    value
      .trim()
      .match(
        /^(-?\d+(?:\.\d+)?)\s*(.*)$/
      );

  if (!match) {
    return null;
  }

  const quantity =
    Number(
      match[1]
    );

  if (
    !Number.isFinite(
      quantity
    )
  ) {
    return null;
  }

  return {
    quantity,

    unit:
      normalizePlannerUnit(
        match[2] ||
          "pcs"
      ),
  };
}


/* ============================================================
   Existing Grocery Lookup
============================================================ */

function findGroceryCandidates(
  shopping:
    ShoppingItem[],
  ingredientName: string
): ShoppingItem[] {
  const normalizedName =
    normalizeText(
      ingredientName
    );

  return shopping.filter(
    (item) =>
      normalizeText(
        item.name
      ) ===
      normalizedName
  );
}


/* ============================================================
   Existing Planner Sources
============================================================ */

function findPlannerSources(
  sources:
    GroceryRequirementSource[],
  weeklyPlanId: string,
  ingredientName: string
): GroceryRequirementSource[] {
  const normalizedName =
    normalizeText(
      ingredientName
    );

  return sources.filter(
    (source) =>
      source.sourceType ===
        "planner" &&
      source.sourceId ===
        weeklyPlanId &&
      normalizeText(
        source.ingredientName
      ) ===
        normalizedName
  );
}


/* ============================================================
   Validate Existing Grocery Item

   We do NOT use generic Grocery quantity
   to reduce Planner demand.

   Generic Grocery is checked only so we
   know whether a future adjustment can be
   safely merged into an existing row.
============================================================ */

function resolveCompatibleGroceryItem(
  shopping:
    ShoppingItem[],
  ingredientName: string,
  requiredUnit: string
): {
  groceryItem?: ShoppingItem;

  hasConflict: boolean;

  message?: string;
} {
  const candidates =
    findGroceryCandidates(
      shopping,
      ingredientName
    );

  if (
    candidates.length ===
    0
  ) {
    return {
      hasConflict:
        false,
    };
  }

  /*
   * Grocery should normally contain only
   * one row per ingredient.
   *
   * If old data contains duplicates,
   * don't guess which row Planner should
   * modify.
   */
  if (
    candidates.length >
    1
  ) {
    return {
      hasConflict:
        true,

      message:
        `${ingredientName} appears more than once in Grocery List. Merge the duplicate Grocery items before Planner updates this ingredient.`,
    };
  }

  const groceryItem =
    candidates[0];

  const parsed =
    parseGroceryQuantity(
      groceryItem.quantity
    );

  if (!parsed) {
    return {
      groceryItem,

      hasConflict:
        true,

      message:
        `Kitchen Brain cannot read the current Grocery quantity for ${ingredientName}.`,
    };
  }

  const normalizedRequiredUnit =
    normalizePlannerUnit(
      requiredUnit
    );

  if (
    parsed.unit !==
    normalizedRequiredUnit
  ) {
    return {
      groceryItem,

      hasConflict:
        true,

      message:
        `${ingredientName} is already in Grocery List as ${groceryItem.quantity}, but Planner requires ${normalizedRequiredUnit}. Review the unit before updating Grocery.`,
    };
  }

  return {
    groceryItem,

    hasConflict:
      false,
  };
}


/* ============================================================
   Analyze One Current Demand
============================================================ */

function reconcileCurrentDemand(
  weeklyPlanId: string,
  demand:
    PlannerIngredientDemand,
  plannerSources:
    GroceryRequirementSource[],
  shopping:
    ShoppingItem[]
): PlannerGroceryReconciliationItem {
  const requiredQuantity =
    demand.shortageQuantity;

  /*
   * If the demand analyzer itself could
   * not safely determine the quantity,
   * Grocery reconciliation must also stop.
   */
  if (
    demand.status ===
    "review"
  ) {
    return {
      ingredientName:
        demand.name,

      normalizedName:
        demand.normalizedName,

      unit:
        demand.unit,

      requiredQuantity,

      allocatedQuantity:
        0,

      adjustmentQuantity:
        0,

      action:
        "review",

      demand,

      message:
        demand.message,
    };
  }

  const matchingSources =
    findPlannerSources(
      plannerSources,
      weeklyPlanId,
      demand.name
    );

  /*
   * Normally one Planner week should own
   * one allocation for one ingredient.
   *
   * Multiple records probably indicate
   * historic/duplicate allocation data.
   */
  if (
    matchingSources.length >
    1
  ) {
    return {
      ingredientName:
        demand.name,

      normalizedName:
        demand.normalizedName,

      unit:
        demand.unit,

      requiredQuantity,

      allocatedQuantity:
        matchingSources.reduce(
          (
            total,
            source
          ) =>
            total +
            Number(
              source.quantity
            ),
          0
        ),

      adjustmentQuantity:
        0,

      action:
        "review",

      demand,

      message:
        `${demand.name} has multiple Grocery allocations for this Planner week. Review the existing Planner allocations before continuing.`,
    };
  }

  const source =
    matchingSources[0];

  let allocatedQuantity =
    0;

  if (source) {
    const sourceUnit =
      normalizePlannerUnit(
        source.unit
      );

    const demandUnit =
      normalizePlannerUnit(
        demand.unit
      );

    if (
      sourceUnit !==
      demandUnit
    ) {
      return {
        ingredientName:
          demand.name,

        normalizedName:
          demand.normalizedName,

        unit:
          demand.unit,

        requiredQuantity,

        allocatedQuantity:
          Number(
            source.quantity
          ),

        adjustmentQuantity:
          0,

        action:
          "review",

        source,

        demand,

        message:
          `${demand.name} was previously allocated as ${source.quantity} ${source.unit}, but the current Planner requirement uses ${demand.unit}. Review the unit before changing Grocery.`,
      };
    }

    allocatedQuantity =
      Number(
        source.quantity
      );
  }

  /*
   * Existing source should point to an
   * actual Grocery item.
   */
  if (source) {
    const sourceGroceryItem =
      shopping.find(
        (item) =>
          item.id ===
          source.groceryItemId
      );

    if (!sourceGroceryItem) {
      return {
        ingredientName:
          demand.name,

        normalizedName:
          demand.normalizedName,

        unit:
          demand.unit,

        requiredQuantity,

        allocatedQuantity,

        adjustmentQuantity:
          0,

        action:
          "review",

        source,

        demand,

        message:
          `${demand.name} has a Planner allocation, but its linked Grocery item no longer exists.`,
      };
    }

    const parsed =
      parseGroceryQuantity(
        sourceGroceryItem.quantity
      );

    if (
      !parsed ||
      parsed.unit !==
        normalizePlannerUnit(
          demand.unit
        )
    ) {
      return {
        ingredientName:
          demand.name,

        normalizedName:
          demand.normalizedName,

        unit:
          demand.unit,

        requiredQuantity,

        allocatedQuantity,

        adjustmentQuantity:
          0,

        action:
          "review",

        groceryItem:
          sourceGroceryItem,

        source,

        demand,

        message:
          `${demand.name}'s Grocery quantity or unit no longer matches its Planner allocation. Review the Grocery item before continuing.`,
      };
    }
  }

  const {
    groceryItem,
    hasConflict,
    message:
      groceryConflictMessage,
  } =
    resolveCompatibleGroceryItem(
      shopping,
      demand.name,
      demand.unit
    );

  if (
    hasConflict
  ) {
    return {
      ingredientName:
        demand.name,

      normalizedName:
        demand.normalizedName,

      unit:
        demand.unit,

      requiredQuantity,

      allocatedQuantity,

      adjustmentQuantity:
        0,

      action:
        "review",

      groceryItem,

      source,

      demand,

      message:
        groceryConflictMessage ||
        "Grocery item requires review.",
    };
  }


  /* ==========================================================
     No Planner Allocation Yet
  ========================================================== */

  if (
    allocatedQuantity ===
      0 &&
    requiredQuantity >
      0
  ) {
    return {
      ingredientName:
        demand.name,

      normalizedName:
        demand.normalizedName,

      unit:
        demand.unit,

      requiredQuantity,

      allocatedQuantity:
        0,

      adjustmentQuantity:
        requiredQuantity,

      action:
        "add",

      groceryItem,

      demand,

      message:
        `Planner needs ${requiredQuantity} ${demand.unit} added to Grocery List.`,
    };
  }


  /* ==========================================================
     Pantry Now Covers Entire Requirement

     Previous Planner allocation exists,
     but current shortage is zero.
  ========================================================== */

  if (
    requiredQuantity ===
      0 &&
    allocatedQuantity >
      0
  ) {
    return {
      ingredientName:
        demand.name,

      normalizedName:
        demand.normalizedName,

      unit:
        demand.unit,

      requiredQuantity:
        0,

      allocatedQuantity,

      adjustmentQuantity:
        allocatedQuantity,

      action:
        "remove",

      groceryItem,

      source,

      demand,

      message:
        `Planner no longer needs ${demand.name} in Grocery. Remove this week's ${allocatedQuantity} ${demand.unit} allocation.`,
    };
  }


  /* ==========================================================
     Demand Increased
  ========================================================== */

  if (
    requiredQuantity >
    allocatedQuantity
  ) {
    const difference =
      requiredQuantity -
      allocatedQuantity;

    return {
      ingredientName:
        demand.name,

      normalizedName:
        demand.normalizedName,

      unit:
        demand.unit,

      requiredQuantity,

      allocatedQuantity,

      adjustmentQuantity:
        difference,

      action:
        "add",

      groceryItem,

      source,

      demand,

      message:
        `Planner requirement increased. Add ${difference} ${demand.unit} to Grocery List.`,
    };
  }


  /* ==========================================================
     Demand Decreased
  ========================================================== */

  if (
    requiredQuantity <
    allocatedQuantity
  ) {
    const difference =
      allocatedQuantity -
      requiredQuantity;

    return {
      ingredientName:
        demand.name,

      normalizedName:
        demand.normalizedName,

      unit:
        demand.unit,

      requiredQuantity,

      allocatedQuantity,

      adjustmentQuantity:
        difference,

      action:
        "reduce",

      groceryItem,

      source,

      demand,

      message:
        `Planner requirement decreased. Reduce this week's Grocery allocation by ${difference} ${demand.unit}.`,
    };
  }


  /* ==========================================================
     No Change
  ========================================================== */

  return {
    ingredientName:
      demand.name,

    normalizedName:
      demand.normalizedName,

    unit:
      demand.unit,

    requiredQuantity,

    allocatedQuantity,

    adjustmentQuantity:
      0,

    action:
      "unchanged",

    groceryItem,

    source,

    demand,

    message:
      `Planner Grocery allocation already matches the current requirement of ${requiredQuantity} ${demand.unit}.`,
  };
}


/* ============================================================
   Find Allocations No Longer Present in Current Demand

   Example:

   Chicken existed in Grocery because of
   Friday Dinner.

   Friday Dinner becomes Ate Out.

   Chicken may disappear completely from
   PlannerDemandAnalysis.

   We still need to detect and remove the
   old Planner allocation.
============================================================ */

function findRemovedPlannerAllocations(
  weeklyPlanId: string,
  demandAnalysis:
    PlannerDemandAnalysis,
  plannerSources:
    GroceryRequirementSource[],
  shopping:
    ShoppingItem[]
): PlannerGroceryReconciliationItem[] {
  const currentDemandNames =
    new Set(
      demandAnalysis
        .ingredientDemands
        .map(
          (item) =>
            item.normalizedName
        )
    );

  return plannerSources
    .filter(
      (source) =>
        source.sourceType ===
          "planner" &&
        source.sourceId ===
          weeklyPlanId &&
        !currentDemandNames.has(
          normalizeText(
            source.ingredientName
          )
        )
    )
    .map(
      (source) => {
        const groceryItem =
          shopping.find(
            (item) =>
              item.id ===
              source.groceryItemId
          );

        if (!groceryItem) {
          return {
            ingredientName:
              source.ingredientName,

            normalizedName:
              normalizeText(
                source.ingredientName
              ),

            unit:
              source.unit,

            requiredQuantity:
              0,

            allocatedQuantity:
              Number(
                source.quantity
              ),

            adjustmentQuantity:
              0,

            action:
              "review" as const,

            source,

            message:
              `${source.ingredientName} is no longer required by this Planner week, but the linked Grocery item no longer exists.`,
          };
        }

        const parsed =
          parseGroceryQuantity(
            groceryItem.quantity
          );

        if (
          !parsed ||
          parsed.unit !==
            normalizePlannerUnit(
              source.unit
            )
        ) {
          return {
            ingredientName:
              source.ingredientName,

            normalizedName:
              normalizeText(
                source.ingredientName
              ),

            unit:
              source.unit,

            requiredQuantity:
              0,

            allocatedQuantity:
              Number(
                source.quantity
              ),

            adjustmentQuantity:
              0,

            action:
              "review" as const,

            groceryItem,

            source,

            message:
              `${source.ingredientName} is no longer required, but its Grocery quantity or unit has changed. Review it before removing the Planner allocation.`,
          };
        }

        return {
          ingredientName:
            source.ingredientName,

          normalizedName:
            normalizeText(
              source.ingredientName
            ),

          unit:
            source.unit,

          requiredQuantity:
            0,

          allocatedQuantity:
            Number(
              source.quantity
            ),

          adjustmentQuantity:
            Number(
              source.quantity
            ),

          action:
            "remove" as const,

          groceryItem,

          source,

          message:
            `${source.ingredientName} is no longer required by the remaining planned meals. Remove this week's ${source.quantity} ${source.unit} Planner allocation.`,
        };
      }
    );
}


/* ============================================================
   Main Planner Grocery Reconciler
============================================================ */

export function reconcilePlannerGrocery(
  weeklyPlanId: string,

  demandAnalysis:
    PlannerDemandAnalysis,

  plannerSources:
    GroceryRequirementSource[],

  shopping:
    ShoppingItem[]
): PlannerGroceryReconciliation {
  const currentDemandItems =
    demandAnalysis
      .ingredientDemands
      .map(
        (demand) =>
          reconcileCurrentDemand(
            weeklyPlanId,
            demand,
            plannerSources,
            shopping
          )
      );

  const removedItems =
    findRemovedPlannerAllocations(
      weeklyPlanId,
      demandAnalysis,
      plannerSources,
      shopping
    );

  const items = [
    ...currentDemandItems,
    ...removedItems,
  ];

  const addCount =
    items.filter(
      (item) =>
        item.action ===
        "add"
    ).length;

  const reduceCount =
    items.filter(
      (item) =>
        item.action ===
        "reduce"
    ).length;

  const removeCount =
    items.filter(
      (item) =>
        item.action ===
        "remove"
    ).length;

  const unchangedCount =
    items.filter(
      (item) =>
        item.action ===
        "unchanged"
    ).length;

  const reviewCount =
    items.filter(
      (item) =>
        item.action ===
        "review"
    ).length;

  return {
    weeklyPlanId,

    items,

    addCount,

    reduceCount,

    removeCount,

    unchangedCount,

    reviewCount,

    hasChanges:
      addCount >
        0 ||
      reduceCount >
        0 ||
      removeCount >
        0,
  };
}