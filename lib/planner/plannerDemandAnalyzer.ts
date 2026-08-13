import {
  PantryItem,
} from "../../types/pantry";

import {
  WeeklyMealPlan,
} from "../../types/plannerV2";


/* ============================================================
   Planner Demand Types
============================================================ */

export type PlannerDemandStatus =
  | "covered"
  | "short"
  | "missing"
  | "review";


export interface PlannerIngredientDemand {
  name: string;

  normalizedName: string;

  requiredQuantity: number;

  pantryQuantity: number;

  shortageQuantity: number;

  unit: string;

  category: string;

  status:
    PlannerDemandStatus;

  sourceRecipeIds: string[];

  sourceRecipeNames: string[];

  message: string;
}


export interface PlannerDemandAnalysis {
  weekStartDate: string;

  ingredientDemands:
    PlannerIngredientDemand[];

  totalIngredients: number;

  coveredIngredients: number;

  shortageIngredients: number;

  reviewIngredients: number;
}


/* ============================================================
   Ingredient Name Normalization
============================================================ */

function normalizeIngredientName(
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
   Unit Normalization

   IMPORTANT:
   This only normalizes safe aliases.

   It does NOT guess ingredient-specific
   conversions such as:

   cup -> grams
   pcs -> grams
============================================================ */

export function normalizePlannerUnit(
  unit: string
): string {
  const normalized =
    unit
      .trim()
      .toLowerCase();

  switch (normalized) {
    /* Weight */

    case "kg":
    case "kgs":
    case "kilogram":
    case "kilograms":
      return "g";

    case "g":
    case "gm":
    case "gms":
    case "gram":
    case "grams":
      return "g";


    /* Volume */

    case "l":
    case "lt":
    case "ltr":
    case "litre":
    case "litres":
    case "liter":
    case "liters":
      return "ml";

    case "ml":
    case "millilitre":
    case "millilitres":
    case "milliliter":
    case "milliliters":
      return "ml";


    /* Pieces */

    case "pc":
    case "pcs":
    case "piece":
    case "pieces":
    case "no":
    case "nos":
    case "number":
    case "numbers":
      return "pcs";


    /* Tablespoon */

    case "tbsp":
    case "tablespoon":
    case "tablespoons":
      return "tbsp";


    /* Teaspoon */

    case "tsp":
    case "teaspoon":
    case "teaspoons":
      return "tsp";


    /* Cup */

    case "cup":
    case "cups":
      return "cup";


    /* Packet */

    case "packet":
    case "packets":
    case "pack":
    case "packs":
      return "packet";


    /* Bunch */

    case "bunch":
    case "bunches":
      return "bunch";


    default:
      return normalized;
  }
}


/* ============================================================
   Convert Quantity to Normalized Unit

   Only conversions that are universally
   safe are performed.
============================================================ */

function convertPlannerQuantity(
  quantity: number,
  originalUnit: string
): number {
  const unit =
    originalUnit
      .trim()
      .toLowerCase();

  switch (unit) {
    /* kg -> g */

    case "kg":
    case "kgs":
    case "kilogram":
    case "kilograms":
      return quantity * 1000;


    /* litres -> ml */

    case "l":
    case "lt":
    case "ltr":
    case "litre":
    case "litres":
    case "liter":
    case "liters":
      return quantity * 1000;


    /*
     * Everything else either already
     * uses its normalized base quantity
     * or has no universally safe
     * conversion.
     */

    default:
      return quantity;
  }
}


/* ============================================================
   Internal Aggregation Type
============================================================ */

type AggregatedIngredient = {
  name: string;

  normalizedName: string;

  quantity: number;

  unit: string;

  sourceRecipeIds:
    Set<string>;

  sourceRecipeNames:
    Set<string>;
};


/* ============================================================
   Collect Remaining Planner Demand

   Only PLANNED meals count toward
   future Grocery demand.

   Cooked:
   meal has already happened.

   Ate Out:
   ingredients are not required.

   Skipped:
   ingredients are not required.
============================================================ */

function collectPlannedIngredients(
  plan: WeeklyMealPlan
): AggregatedIngredient[] {
  const ingredientMap =
    new Map<
      string,
      AggregatedIngredient
    >();

  const plannedMeals =
    plan.meals.filter(
      (meal) =>
        meal.status ===
        "planned"
    );

  for (
    const meal of
    plannedMeals
  ) {
    for (
      const mealRecipe of
      meal.recipes
    ) {
      const recipe =
        mealRecipe.recipe;

      if (!recipe) {
        continue;
      }

      for (
        const ingredient of
        recipe.ingredients
      ) {
        const name =
          ingredient.name.trim();

        if (!name) {
          continue;
        }

        const normalizedName =
          normalizeIngredientName(
            name
          );

        const normalizedUnit =
          normalizePlannerUnit(
            ingredient.unit
          );

        const quantity =
          convertPlannerQuantity(
            Number(
              ingredient.quantity
            ),
            ingredient.unit
          );

        if (
          !Number.isFinite(
            quantity
          ) ||
          quantity <= 0
        ) {
          continue;
        }

        /*
         * Unit is part of the key.
         *
         * This deliberately prevents:
         *
         * Salt 10 g
         * +
         * Salt 2 tbsp
         *
         * from being silently combined.
         */
        const key =
          `${normalizedName}::${normalizedUnit}`;

        const existing =
          ingredientMap.get(
            key
          );

        if (existing) {
          existing.quantity +=
            quantity;

          existing
            .sourceRecipeIds
            .add(
              recipe.id
            );

          existing
            .sourceRecipeNames
            .add(
              recipe.name
            );

          continue;
        }

        ingredientMap.set(
          key,
          {
            name,

            normalizedName,

            quantity,

            unit:
              normalizedUnit,

            sourceRecipeIds:
              new Set([
                recipe.id,
              ]),

            sourceRecipeNames:
              new Set([
                recipe.name,
              ]),
          }
        );
      }
    }
  }

  return Array.from(
    ingredientMap.values()
  );
}


/* ============================================================
   Find Pantry Candidates
============================================================ */

function findPantryCandidates(
  ingredient:
    AggregatedIngredient,
  pantry:
    PantryItem[]
): PantryItem[] {
  return pantry.filter(
    (item) =>
      normalizeIngredientName(
        item.name
      ) ===
      ingredient.normalizedName
  );
}


/* ============================================================
   Calculate Available Pantry Quantity
============================================================ */

function calculatePantryAvailability(
  ingredient:
    AggregatedIngredient,
  pantryCandidates:
    PantryItem[]
) {
  let compatibleQuantity =
    0;

  let hasIncompatibleUnit =
    false;

  let category =
    "Grocery";

  for (
    const pantryItem of
    pantryCandidates
  ) {
    if (
      pantryItem.category
    ) {
      category =
        pantryItem.category;
    }

    const pantryUnit =
      normalizePlannerUnit(
        pantryItem.unit
      );

    if (
      pantryUnit !==
      ingredient.unit
    ) {
      hasIncompatibleUnit =
        true;

      continue;
    }

    const quantity =
      convertPlannerQuantity(
        Number(
          pantryItem.quantity
        ),
        pantryItem.unit
      );

    if (
      Number.isFinite(
        quantity
      ) &&
      quantity > 0
    ) {
      compatibleQuantity +=
        quantity;
    }
  }

  return {
    compatibleQuantity,

    hasIncompatibleUnit,

    category,
  };
}


/* ============================================================
   Detect Same Ingredient in Multiple
   Incompatible Recipe Units

   Example:

   Salt 10 g
   Salt 2 tbsp

   These remain separate aggregation
   records, but both should be flagged
   for review so the UI does not make
   them look like unrelated ingredients.
============================================================ */

function findRecipeUnitConflicts(
  ingredients:
    AggregatedIngredient[]
): Set<string> {
  const unitsByIngredient =
    new Map<
      string,
      Set<string>
    >();

  for (
    const ingredient of
    ingredients
  ) {
    const units =
      unitsByIngredient.get(
        ingredient
          .normalizedName
      ) ??
      new Set<string>();

    units.add(
      ingredient.unit
    );

    unitsByIngredient.set(
      ingredient
        .normalizedName,
      units
    );
  }

  const conflicts =
    new Set<string>();

  for (
    const [
      ingredientName,
      units,
    ] of
    unitsByIngredient
  ) {
    if (
      units.size > 1
    ) {
      conflicts.add(
        ingredientName
      );
    }
  }

  return conflicts;
}


/* ============================================================
   Analyze One Ingredient
============================================================ */

function analyzeIngredient(
  ingredient:
    AggregatedIngredient,
  pantry:
    PantryItem[],
  recipeUnitConflicts:
    Set<string>
): PlannerIngredientDemand {
  const pantryCandidates =
    findPantryCandidates(
      ingredient,
      pantry
    );

  const {
    compatibleQuantity,
    hasIncompatibleUnit,
    category,
  } =
    calculatePantryAvailability(
      ingredient,
      pantryCandidates
    );

  const hasRecipeUnitConflict =
    recipeUnitConflicts.has(
      ingredient.normalizedName
    );


  /*
   * Same ingredient is being requested
   * by recipes using incompatible units.
   *
   * Never guess.
   */
  if (
    hasRecipeUnitConflict
  ) {
    return {
      name:
        ingredient.name,

      normalizedName:
        ingredient.normalizedName,

      requiredQuantity:
        ingredient.quantity,

      pantryQuantity:
        compatibleQuantity,

      shortageQuantity:
        Math.max(
          ingredient.quantity -
            compatibleQuantity,
          0
        ),

      unit:
        ingredient.unit,

      category,

      status:
        "review",

      sourceRecipeIds:
        Array.from(
          ingredient
            .sourceRecipeIds
        ),

      sourceRecipeNames:
        Array.from(
          ingredient
            .sourceRecipeNames
        ),

      message:
        `${ingredient.name} is used with different units across planned recipes. Review the quantities before adding it to Grocery.`,
    };
  }


  /*
   * Pantry contains the ingredient,
   * but only in an incompatible unit.
   *
   * Example:
   * Recipe needs 200 g tomato
   * Pantry contains 3 pcs tomato.
   */
  if (
    compatibleQuantity ===
      0 &&
    hasIncompatibleUnit
  ) {
    return {
      name:
        ingredient.name,

      normalizedName:
        ingredient.normalizedName,

      requiredQuantity:
        ingredient.quantity,

      pantryQuantity:
        0,

      shortageQuantity:
        ingredient.quantity,

      unit:
        ingredient.unit,

      category,

      status:
        "review",

      sourceRecipeIds:
        Array.from(
          ingredient
            .sourceRecipeIds
        ),

      sourceRecipeNames:
        Array.from(
          ingredient
            .sourceRecipeNames
        ),

      message:
        `${ingredient.name} exists in Home Inventory with a different unit. Review before adding it to Grocery.`,
    };
  }


  const shortage =
    Math.max(
      ingredient.quantity -
        compatibleQuantity,
      0
    );


  if (
    shortage <= 0
  ) {
    return {
      name:
        ingredient.name,

      normalizedName:
        ingredient.normalizedName,

      requiredQuantity:
        ingredient.quantity,

      pantryQuantity:
        compatibleQuantity,

      shortageQuantity:
        0,

      unit:
        ingredient.unit,

      category,

      status:
        "covered",

      sourceRecipeIds:
        Array.from(
          ingredient
            .sourceRecipeIds
        ),

      sourceRecipeNames:
        Array.from(
          ingredient
            .sourceRecipeNames
        ),

      message:
        "Home Inventory has enough stock.",
    };
  }


  const status:
    PlannerDemandStatus =
    pantryCandidates.length ===
      0
      ? "missing"
      : "short";


  return {
    name:
      ingredient.name,

    normalizedName:
      ingredient.normalizedName,

    requiredQuantity:
      ingredient.quantity,

    pantryQuantity:
      compatibleQuantity,

    shortageQuantity:
      shortage,

    unit:
      ingredient.unit,

    category,

    status,

    sourceRecipeIds:
      Array.from(
        ingredient
          .sourceRecipeIds
      ),

    sourceRecipeNames:
      Array.from(
        ingredient
          .sourceRecipeNames
      ),

    message:
      status ===
      "missing"
        ? "Not available in Home Inventory."
        : `Home Inventory is short by ${shortage} ${ingredient.unit}.`,
  };
}


/* ============================================================
   Main Weekly Planner Demand Analyzer
============================================================ */

export function analyzeWeeklyPlannerDemand(
  plan:
    WeeklyMealPlan,
  pantry:
    PantryItem[]
): PlannerDemandAnalysis {
  const aggregatedIngredients =
    collectPlannedIngredients(
      plan
    );

  const recipeUnitConflicts =
    findRecipeUnitConflicts(
      aggregatedIngredients
    );

  const ingredientDemands =
    aggregatedIngredients
      .map(
        (ingredient) =>
          analyzeIngredient(
            ingredient,
            pantry,
            recipeUnitConflicts
          )
      )
      .sort(
        (
          first,
          second
        ) =>
          first.name.localeCompare(
            second.name
          )
      );

  const coveredIngredients =
    ingredientDemands.filter(
      (item) =>
        item.status ===
        "covered"
    ).length;

  const shortageIngredients =
    ingredientDemands.filter(
      (item) =>
        item.status ===
          "short" ||
        item.status ===
          "missing"
    ).length;

  const reviewIngredients =
    ingredientDemands.filter(
      (item) =>
        item.status ===
        "review"
    ).length;

  return {
    weekStartDate:
      plan.weekStartDate,

    ingredientDemands,

    totalIngredients:
      ingredientDemands.length,

    coveredIngredients,

    shortageIngredients,

    reviewIngredients,
  };
}