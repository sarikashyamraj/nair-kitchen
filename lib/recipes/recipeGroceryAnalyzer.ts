import {
  PantryItem,
} from "../../types/pantry";

import {
  RecipeIngredient,
} from "../../types/recipe";

import {
  ShoppingItem,
} from "../../types/shopping";

import {
  GroceryRequirementSource,
} from "../../types/groceryRequirementSource";

/* ==========================================
   Types
========================================== */

export type RecipeIngredientStatus =
  | "available"
  | "short"
  | "missing"
  | "grocery_covered"
  | "needs_review";

export type RecipeIngredientAnalysis = {
  ingredient: RecipeIngredient;

  status: RecipeIngredientStatus;

  pantryItem?: PantryItem;

  groceryItem?: ShoppingItem;

  /*
   * Quantity required by the recipe.
   */
  requiredQuantity: number;

  /*
   * Pantry quantity converted into
   * the recipe ingredient unit.
   */
  pantryAvailableQuantity: number;

  /*
   * Total quantity currently shown
   * in Grocery List.
   *
   * IMPORTANT:
   * This does NOT reduce another
   * recipe's requirement.
   */
  groceryQuantity: number;

  /*
   * Quantity already allocated to
   * Grocery by THIS SAME recipe.
   */
  allocatedQuantity: number;

  /*
   * Additional quantity this recipe
   * still needs to contribute.
   */
  quantityToAdd: number;

  /*
   * Quantity previously allocated by
   * this recipe that is now above the
   * current requirement.
   *
   * Used for Review / reduction flow.
   */
  quantityToReduce: number;

  unit: string;

  category: string;

  selectedByDefault: boolean;

  message: string;
};

export type RecipeGroceryAnalysis = {
  ingredients: RecipeIngredientAnalysis[];

  availableCount: number;

  shortCount: number;

  missingCount: number;

  groceryCoveredCount: number;

  needsReviewCount: number;

  suggestedCount: number;
};

/* ==========================================
   Normalization
========================================== */

function normalizeText(
  value: string
) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function normalizeUnit(
  value: string
) {
  const normalized =
    normalizeText(value);

  const aliases:
    Record<string, string> = {
      gram: "g",
      grams: "g",

      kilogram: "kg",
      kilograms: "kg",
      kgs: "kg",

      milliliter: "ml",
      milliliters: "ml",
      millilitre: "ml",
      millilitres: "ml",

      liter: "l",
      liters: "l",
      litre: "l",
      litres: "l",

      piece: "pcs",
      pieces: "pcs",
      pc: "pcs",
      pcs: "pcs",
      nos: "pcs",
      no: "pcs",

      tablespoon: "tbsp",
      tablespoons: "tbsp",

      teaspoon: "tsp",
      teaspoons: "tsp",
    };

  return (
    aliases[normalized] ??
    normalized
  );
}

/* ==========================================
   Quantity Parsing
========================================== */

type ParsedShoppingQuantity = {
  quantity: number;
  unit: string;
};

function parseShoppingQuantity(
  quantityText: string
): ParsedShoppingQuantity | null {
  const match =
    quantityText
      .trim()
      .match(
        /^(-?\d+(?:\.\d+)?)\s*(.*)$/
      );

  if (!match) {
    return null;
  }

  const quantity =
    Number(match[1]);

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
      normalizeUnit(
        match[2] ||
          "pcs"
      ),
  };
}

/* ==========================================
   Unit Conversion
========================================== */

function convertQuantity(
  quantity: number,
  fromUnit: string,
  toUnit: string
): number | null {
  const from =
    normalizeUnit(
      fromUnit
    );

  const to =
    normalizeUnit(
      toUnit
    );

  /*
   * Same unit.
   */
  if (from === to) {
    return quantity;
  }

  /* Weight */

  if (
    from === "kg" &&
    to === "g"
  ) {
    return (
      quantity * 1000
    );
  }

  if (
    from === "g" &&
    to === "kg"
  ) {
    return (
      quantity / 1000
    );
  }

  /* Volume */

  if (
    from === "l" &&
    to === "ml"
  ) {
    return (
      quantity * 1000
    );
  }

  if (
    from === "ml" &&
    to === "l"
  ) {
    return (
      quantity / 1000
    );
  }

  /*
   * Unknown / unsafe conversion.
   *
   * Examples:
   * jar -> tbsp
   * packet -> g
   */
  return null;
}

/* ==========================================
   Pantry / Grocery Matching
========================================== */

function findPantryItem(
  pantry: PantryItem[],
  ingredientName: string
) {
  const normalizedName =
    normalizeText(
      ingredientName
    );

  return pantry.find(
    (item) =>
      normalizeText(
        item.name
      ) === normalizedName
  );
}

function findGroceryItem(
  shopping: ShoppingItem[],
  ingredientName: string
) {
  const normalizedName =
    normalizeText(
      ingredientName
    );

  return shopping.find(
    (item) =>
      normalizeText(
        item.name
      ) === normalizedName
  );
}

/* ==========================================
   Existing Grocery Quantity

   Informational only.

   Generic Grocery quantity must NOT
   reduce a new recipe's requirement.
========================================== */

function getGroceryQuantity(
  groceryItem:
    ShoppingItem | undefined,
  ingredientUnit: string
) {
  if (!groceryItem) {
    return 0;
  }

  const parsed =
    parseShoppingQuantity(
      groceryItem.quantity
    );

  if (!parsed) {
    return 0;
  }

  const converted =
    convertQuantity(
      parsed.quantity,
      parsed.unit,
      ingredientUnit
    );

  return (
    converted ?? 0
  );
}

/* ==========================================
   Recipe Source Allocation

   Only allocation belonging to THIS
   SAME recipe can prevent the recipe
   from contributing the same quantity
   repeatedly.
========================================== */

function getRecipeAllocationQuantity(
  requirementSources:
    GroceryRequirementSource[],
  recipeId: string,
  ingredientName: string,
  ingredientUnit: string
) {
  const normalizedName =
    normalizeText(
      ingredientName
    );

  let total = 0;

  for (
    const source of
    requirementSources
  ) {
    if (
      source.sourceType !==
        "recipe" ||
      source.sourceId !==
        recipeId ||
      normalizeText(
        source.ingredientName
      ) !== normalizedName
    ) {
      continue;
    }

    const converted =
      convertQuantity(
        source.quantity,
        source.unit,
        ingredientUnit
      );

    if (
      converted !== null
    ) {
      total += converted;
    }
  }

  return total;
}

/* ==========================================
   Single Ingredient Analysis
========================================== */

export function analyzeRecipeIngredient(
  recipeId: string,
  ingredient: RecipeIngredient,
  pantry: PantryItem[],
  shopping: ShoppingItem[],
  requirementSources:
    GroceryRequirementSource[]
): RecipeIngredientAnalysis {
  const requiredQuantity =
    Number(
      ingredient.quantity
    );

  const ingredientUnit =
    normalizeUnit(
      ingredient.unit
    );

  const pantryItem =
    findPantryItem(
      pantry,
      ingredient.name
    );

  const groceryItem =
    findGroceryItem(
      shopping,
      ingredient.name
    );

  const groceryQuantity =
    getGroceryQuantity(
      groceryItem,
      ingredientUnit
    );

  const allocatedQuantity =
    getRecipeAllocationQuantity(
      requirementSources,
      recipeId,
      ingredient.name,
      ingredientUnit
    );

  /* ========================================
     Ingredient not in Home Inventory
  ======================================== */

  if (!pantryItem) {
    const recipeShortage =
      requiredQuantity;

    /*
     * Recipe requirement has DECREASED.
     *
     * Example:
     *
     * Previously allocated = 15 pcs
     * Recipe now requires = 8 pcs
     *
     * Excess = 7 pcs
     */
    if (
      allocatedQuantity >
      recipeShortage
    ) {
      const quantityToReduce =
        allocatedQuantity -
        recipeShortage;

      return {
        ingredient,

        status:
          "needs_review",

        groceryItem,

        requiredQuantity,

        pantryAvailableQuantity:
          0,

        groceryQuantity,

        allocatedQuantity,

        quantityToAdd: 0,

        quantityToReduce,

        unit:
          ingredient.unit,

        category:
          groceryItem?.category ||
          "Other",

        selectedByDefault:
          false,

        message:
          `Recipe now needs ${requiredQuantity} ${ingredient.unit}. This recipe previously allocated ${allocatedQuantity} ${ingredient.unit}, so ${quantityToReduce} ${ingredient.unit} can be reduced from Grocery List.`,
      };
    }

    const quantityToAdd =
      Math.max(
        recipeShortage -
          allocatedQuantity,
        0
      );

    /*
     * Recipe shortage already fully
     * allocated.
     */
    if (
      quantityToAdd === 0 &&
      allocatedQuantity > 0
    ) {
      return {
        ingredient,

        status:
          "grocery_covered",

        groceryItem,

        requiredQuantity,

        pantryAvailableQuantity:
          0,

        groceryQuantity,

        allocatedQuantity,

        quantityToAdd: 0,

        quantityToReduce: 0,

        unit:
          ingredient.unit,

        category:
          groceryItem?.category ||
          "Other",

        selectedByDefault:
          false,

        message:
          `This recipe already added ${allocatedQuantity} ${ingredient.unit} to Grocery List.`,
      };
    }

    /*
     * Ingredient missing and this recipe
     * still needs to contribute quantity.
     */
    return {
      ingredient,

      status:
        "missing",

      groceryItem,

      requiredQuantity,

      pantryAvailableQuantity:
        0,

      groceryQuantity,

      allocatedQuantity,

      quantityToAdd,

      quantityToReduce: 0,

      unit:
        ingredient.unit,

      category:
        groceryItem?.category ||
        "Other",

      selectedByDefault:
        quantityToAdd > 0,

      message:
        allocatedQuantity > 0
          ? `Not available in Home Inventory. This recipe already allocated ${allocatedQuantity} ${ingredient.unit}; ${quantityToAdd} ${ingredient.unit} more is needed.`
          : "Not available in Home Inventory.",
    };
  }

  /* ========================================
     Convert Pantry quantity
  ======================================== */

  const pantryConverted =
    convertQuantity(
      pantryItem.quantity,
      pantryItem.unit,
      ingredientUnit
    );

  /* ========================================
     Pantry unit cannot safely be compared
  ======================================== */

  if (
    pantryConverted === null
  ) {
    const quantityToReduce =
      Math.max(
        allocatedQuantity -
          requiredQuantity,
        0
      );

    return {
      ingredient,

      status:
        "needs_review",

      pantryItem,

      groceryItem,

      requiredQuantity,

      pantryAvailableQuantity:
        pantryItem.quantity,

      groceryQuantity,

      allocatedQuantity,

      quantityToAdd:
        quantityToReduce > 0
          ? 0
          : Math.max(
              requiredQuantity -
                allocatedQuantity,
              0
            ),

      quantityToReduce,

      unit:
        ingredient.unit,

      category:
        pantryItem.category,

      selectedByDefault:
        false,

      message:
        quantityToReduce > 0
          ? `Home Inventory has ${pantryItem.quantity} ${pantryItem.unit}, which cannot be safely compared with ${requiredQuantity} ${ingredient.unit}. This recipe also has ${quantityToReduce} ${ingredient.unit} more allocated than its current recipe requirement.`
          : `Home Inventory has ${pantryItem.quantity} ${pantryItem.unit}, but it cannot be safely compared with ${requiredQuantity} ${ingredient.unit}.`,
    };
  }

  /* ========================================
     Pantry itself covers the recipe
  ======================================== */

  if (
    pantryConverted >=
    requiredQuantity
  ) {
    /*
     * If this recipe previously added
     * Grocery quantity but Pantry now
     * covers the full requirement,
     * that allocation is potentially
     * unnecessary.
     */
    if (
      allocatedQuantity > 0
    ) {
      return {
        ingredient,

        status:
          "needs_review",

        pantryItem,

        groceryItem,

        requiredQuantity,

        pantryAvailableQuantity:
          pantryConverted,

        groceryQuantity,

        allocatedQuantity,

        quantityToAdd: 0,

        quantityToReduce:
          allocatedQuantity,

        unit:
          ingredient.unit,

        category:
          pantryItem.category,

        selectedByDefault:
          false,

        message:
          `Home Inventory now covers the full ${requiredQuantity} ${ingredient.unit} required by this recipe. This recipe previously allocated ${allocatedQuantity} ${ingredient.unit} to Grocery List.`,
      };
    }

    return {
      ingredient,

      status:
        "available",

      pantryItem,

      groceryItem,

      requiredQuantity,

      pantryAvailableQuantity:
        pantryConverted,

      groceryQuantity,

      allocatedQuantity,

      quantityToAdd: 0,

      quantityToReduce: 0,

      unit:
        ingredient.unit,

      category:
        pantryItem.category,

      selectedByDefault:
        false,

      message:
        `Available in Home Inventory: ${pantryConverted} ${ingredient.unit}.`,
    };
  }

  /* ========================================
     Pantry is short
  ======================================== */

  const recipeShortage =
    Math.max(
      requiredQuantity -
        pantryConverted,
      0
    );

  /*
   * Recipe now needs LESS Grocery
   * quantity than it previously
   * allocated.
   */
  if (
    allocatedQuantity >
    recipeShortage
  ) {
    const quantityToReduce =
      allocatedQuantity -
      recipeShortage;

    return {
      ingredient,

      status:
        "needs_review",

      pantryItem,

      groceryItem,

      requiredQuantity,

      pantryAvailableQuantity:
        pantryConverted,

      groceryQuantity,

      allocatedQuantity,

      quantityToAdd: 0,

      quantityToReduce,

      unit:
        ingredient.unit,

      category:
        pantryItem.category,

      selectedByDefault:
        false,

      message:
        `Need ${requiredQuantity} ${ingredient.unit}. Home Inventory has ${pantryConverted} ${ingredient.unit}. This recipe previously allocated ${allocatedQuantity} ${ingredient.unit}, so ${quantityToReduce} ${ingredient.unit} can be reduced from Grocery List.`,
    };
  }

  /*
   * Only THIS recipe's previous
   * allocation reduces its remaining
   * requirement.
   *
   * Generic Grocery quantity is not
   * subtracted.
   */
  const quantityToAdd =
    Math.max(
      recipeShortage -
        allocatedQuantity,
      0
    );

  /*
   * Recipe's shortage is already fully
   * allocated to Grocery.
   */
  if (
    quantityToAdd === 0 &&
    allocatedQuantity > 0
  ) {
    return {
      ingredient,

      status:
        "grocery_covered",

      pantryItem,

      groceryItem,

      requiredQuantity,

      pantryAvailableQuantity:
        pantryConverted,

      groceryQuantity,

      allocatedQuantity,

      quantityToAdd: 0,

      quantityToReduce: 0,

      unit:
        ingredient.unit,

      category:
        pantryItem.category,

      selectedByDefault:
        false,

      message:
        `Home Inventory is short by ${recipeShortage} ${ingredient.unit}, and this recipe already added that requirement to Grocery List.`,
    };
  }

  /*
   * Pantry shortage still needs to be
   * added by this recipe.
   */
  return {
    ingredient,

    status:
      "short",

    pantryItem,

    groceryItem,

    requiredQuantity,

    pantryAvailableQuantity:
      pantryConverted,

    groceryQuantity,

    allocatedQuantity,

    quantityToAdd,

    quantityToReduce: 0,

    unit:
      ingredient.unit,

    category:
      pantryItem.category,

    selectedByDefault:
      quantityToAdd > 0,

    message:
      allocatedQuantity > 0
        ? `Need ${requiredQuantity} ${ingredient.unit}. Home Inventory has ${pantryConverted} ${ingredient.unit}. This recipe already allocated ${allocatedQuantity} ${ingredient.unit}; ${quantityToAdd} ${ingredient.unit} more is needed.`
        : `Need ${requiredQuantity} ${ingredient.unit}. Home Inventory has ${pantryConverted} ${ingredient.unit}.`,
  };
}

/* ==========================================
   Full Recipe Analysis
========================================== */

export function analyzeRecipeForGrocery(
  recipeId: string,

  ingredients:
    RecipeIngredient[],

  pantry:
    PantryItem[],

  shopping:
    ShoppingItem[],

  requirementSources:
    GroceryRequirementSource[]
): RecipeGroceryAnalysis {
  const analyzedIngredients =
    ingredients.map(
      (ingredient) =>
        analyzeRecipeIngredient(
          recipeId,
          ingredient,
          pantry,
          shopping,
          requirementSources
        )
    );

  const availableCount =
    analyzedIngredients.filter(
      (item) =>
        item.status ===
        "available"
    ).length;

  const shortCount =
    analyzedIngredients.filter(
      (item) =>
        item.status ===
        "short"
    ).length;

  const missingCount =
    analyzedIngredients.filter(
      (item) =>
        item.status ===
        "missing"
    ).length;

  const groceryCoveredCount =
    analyzedIngredients.filter(
      (item) =>
        item.status ===
        "grocery_covered"
    ).length;

  const needsReviewCount =
    analyzedIngredients.filter(
      (item) =>
        item.status ===
        "needs_review"
    ).length;

  const suggestedCount =
    analyzedIngredients.filter(
      (item) =>
        item.selectedByDefault
    ).length;

  return {
    ingredients:
      analyzedIngredients,

    availableCount,

    shortCount,

    missingCount,

    groceryCoveredCount,

    needsReviewCount,

    suggestedCount,
  };
}