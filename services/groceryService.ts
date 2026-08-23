import {
  createClient,
} from "../utils/supabase/client";

import {
  ShoppingItem,
} from "../types/shopping";

import {
  convertGroceryQuantityToNormalizedUnit,
  normalizeGroceryName,
  normalizeGroceryUnit,
} from "../lib/grocery/groceryIdentity";


type GroceryItemRow = {
  id: string;

  user_id: string;

  name: string;

  category: string;

  quantity:
    number | string;

  unit: string;

  purchased: boolean;

  notes:
    string | null;
};


async function getAuthenticatedUser() {
  const supabase =
    createClient();

  const {
    data: {
      user,
    },
    error,
  } =
    await supabase.auth.getUser();

  if (error) {
    throw new Error(
      error.message
    );
  }

  if (!user) {
    throw new Error(
      "You must be signed in to access Grocery."
    );
  }

  return {
    supabase,
    user,
  };
}


/* ============================================================
   Mapping
============================================================ */

function mapGroceryRow(
  row:
    GroceryItemRow
): ShoppingItem {
  return {
    id:
      row.id,

    name:
      row.name,

    category:
      row.category,

    quantity:
      `${Number(
        row.quantity
      )} ${row.unit}`.trim(),

    purchased:
      row.purchased,
  };
}


/* ============================================================
   Quantity Parsing
============================================================ */

function parseQuantity(
  quantityText: string
) {
  const trimmedQuantity =
    quantityText.trim();

  const parts =
    trimmedQuantity.split(
      /\s+/
    );

  const numericQuantity =
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
      numericQuantity
    ) ||
    numericQuantity <= 0
  ) {
    throw new Error(
      "Grocery quantity must be greater than zero."
    );
  }

  const normalizedUnit =
    normalizeGroceryUnit(
      rawUnit
    );

  const normalizedQuantity =
    convertGroceryQuantityToNormalizedUnit(
      numericQuantity,
      rawUnit
    );

  return {
    quantity:
      normalizedQuantity,

    unit:
      normalizedUnit,
  };
}


/* ============================================================
   UUID Helper
============================================================ */

function isUuid(
  value: string
) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}


/* ============================================================
   Load Grocery
============================================================ */

export async function loadCloudGrocery():
Promise<ShoppingItem[]> {
  const {
    supabase,
    user,
  } =
    await getAuthenticatedUser();

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "grocery_items"
      )
      .select(
        `
          id,
          user_id,
          name,
          category,
          quantity,
          unit,
          purchased,
          notes
        `
      )
      .eq(
        "user_id",
        user.id
      )
      .order(
        "created_at",
        {
          ascending:
            true,
        }
      );

  if (error) {
    throw new Error(
      error.message
    );
  }

  return (
    data as GroceryItemRow[]
  ).map(
    mapGroceryRow
  );
}


/* ============================================================
   Save Grocery Item

   Rules:

   1. Existing UUID:
      Update that exact row.

   2. New Grocery item:
      Search for the same normalized
      ingredient + compatible unit.

   3. One compatible row:
      Merge quantities.

   4. Multiple compatible rows:
      Stop. Existing Grocery data needs
      cleanup rather than guessing.

   5. No compatible row:
      Insert a new Grocery item.
============================================================ */

export async function saveCloudGroceryItem(
  item:
    ShoppingItem
): Promise<ShoppingItem> {
  const {
    supabase,
    user,
  } =
    await getAuthenticatedUser();

  const parsedQuantity =
    parseQuantity(
      item.quantity
    );

  const normalizedName =
    normalizeGroceryName(
      item.name
    );

  const hasUuid =
    isUuid(
      item.id
    );


  /* ==========================================================
     STEP 1
     Check whether this exact Grocery
     record already exists.
  ========================================================== */

  let cloudItemExists =
    false;

  if (hasUuid) {
    const {
      data:
        existingItem,
      error:
        checkError,
    } =
      await supabase
        .from(
          "grocery_items"
        )
        .select(
          "id"
        )
        .eq(
          "id",
          item.id
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

    if (checkError) {
      throw new Error(
        checkError.message
      );
    }

    cloudItemExists =
      Boolean(
        existingItem
      );
  }


  /* ==========================================================
     STEP 2
     Existing row → normal update.

     IMPORTANT:
     We do NOT add quantities here.

     The caller is editing/updating an
     already known Grocery record.
  ========================================================== */

  if (cloudItemExists) {
    const payload = {
      user_id:
        user.id,

      name:
        item.name.trim(),

      category:
        item.category,

      quantity:
        parsedQuantity.quantity,

      unit:
        parsedQuantity.unit,

      purchased:
        item.purchased,
    };

    const {
      data:
        updatedItem,
      error:
        updateError,
    } =
      await supabase
        .from(
          "grocery_items"
        )
        .update(
          payload
        )
        .eq(
          "id",
          item.id
        )
        .eq(
          "user_id",
          user.id
        )
        .select(
          `
            id,
            user_id,
            name,
            category,
            quantity,
            unit,
            purchased,
            notes
          `
        )
        .single();

    if (updateError) {
      throw new Error(
        updateError.message
      );
    }

    return mapGroceryRow(
      updatedItem as GroceryItemRow
    );
  }


  /* ==========================================================
     STEP 3
     New item.

     Load Grocery rows with this user and
     determine whether a compatible row
     already exists.
  ========================================================== */

  const {
    data:
      existingRows,
    error:
      existingRowsError,
  } =
    await supabase
      .from(
        "grocery_items"
      )
      .select(
        `
          id,
          user_id,
          name,
          category,
          quantity,
          unit,
          purchased,
          notes
        `
      )
      .eq(
        "user_id",
        user.id
      );

  if (
    existingRowsError
  ) {
    throw new Error(
      existingRowsError.message
    );
  }

  const sameIngredientRows =
    (
      existingRows as GroceryItemRow[]
    ).filter(
      (row) =>
        normalizeGroceryName(
          row.name
        ) ===
        normalizedName
    );


  /*
   * Same ingredient is only compatible
   * if its normalized unit matches.
   *
   * Example:
   *
   * 1 kg + 500 g   → compatible
   * 2 Nos + 3 pcs  → compatible
   *
   * 100 g + 2 tbsp → NOT compatible
   */

  const compatibleRows =
    sameIngredientRows.filter(
      (row) =>
        normalizeGroceryUnit(
          row.unit
        ) ===
        parsedQuantity.unit
    );


  /* ==========================================================
     STEP 4
     Existing duplicate data.

     Do not silently choose one row.
  ========================================================== */

  if (
    compatibleRows.length >
    1
  ) {
    throw new Error(
      `${item.name} appears more than once in Grocery List with the same unit. Merge the duplicate items before adding more.`
    );
  }


  /* ==========================================================
     STEP 5
     One compatible Grocery row exists.

     Merge the NEW requirement into the
     existing Grocery quantity.
  ========================================================== */

  if (
    compatibleRows.length ===
    1
  ) {
    const existingRow =
      compatibleRows[0];

    const existingQuantity =
      convertGroceryQuantityToNormalizedUnit(
        Number(
          existingRow.quantity
        ),
        existingRow.unit
      );

    if (
      !Number.isFinite(
        existingQuantity
      )
    ) {
      throw new Error(
        `Unable to read the existing Grocery quantity for ${item.name}.`
      );
    }

    const mergedQuantity =
      existingQuantity +
      parsedQuantity.quantity;

    const {
      data:
        mergedItem,
      error:
        mergeError,
    } =
      await supabase
        .from(
          "grocery_items"
        )
        .update({
          /*
           * Keep the existing display
           * name/category where possible.
           */
          name:
            existingRow.name,

          category:
            existingRow.category ||
            item.category,

          quantity:
            mergedQuantity,

          unit:
            parsedQuantity.unit,

          /*
           * A newly added requirement means
           * the Grocery item is active again.
           */
          purchased:
            false,
        })
        .eq(
          "id",
          existingRow.id
        )
        .eq(
          "user_id",
          user.id
        )
        .select(
          `
            id,
            user_id,
            name,
            category,
            quantity,
            unit,
            purchased,
            notes
          `
        )
        .single();

    if (mergeError) {
      throw new Error(
        mergeError.message
      );
    }

    return mapGroceryRow(
      mergedItem as GroceryItemRow
    );
  }


  /* ==========================================================
     STEP 6
     No compatible Grocery row exists.

     Create a new row.
  ========================================================== */

  const insertPayload = {
    user_id:
      user.id,

    name:
      item.name.trim(),

    category:
      item.category,

    quantity:
      parsedQuantity.quantity,

    unit:
      parsedQuantity.unit,

    purchased:
      item.purchased,
  };

  const {
    data:
      insertedItem,
    error:
      insertError,
  } =
    await supabase
      .from(
        "grocery_items"
      )
      .insert({
        ...insertPayload,

        ...(hasUuid
          ? {
              id:
                item.id,
            }
          : {}),
      })
      .select(
        `
          id,
          user_id,
          name,
          category,
          quantity,
          unit,
          purchased,
          notes
        `
      )
      .single();

  if (insertError) {
    throw new Error(
      insertError.message
    );
  }

  return mapGroceryRow(
    insertedItem as GroceryItemRow
  );
}


/* ============================================================
   Save Many Grocery Items
============================================================ */

export async function saveCloudGroceryItems(
  items:
    ShoppingItem[]
): Promise<ShoppingItem[]> {
  /*
   * Use sequential saves instead of
   * Promise.all.
   *
   * Why?
   *
   * If two new incoming items represent
   * the same ingredient, the second save
   * must be able to see the first one.
   *
   * Parallel writes could still create
   * duplicates.
   */

  const savedItems:
    ShoppingItem[] = [];

  for (
    const item of
    items
  ) {
    const savedItem =
      await saveCloudGroceryItem(
        item
      );

    savedItems.push(
      savedItem
    );
  }

  return savedItems;
}


/* ============================================================
   Delete Grocery Item
============================================================ */

export async function deleteCloudGroceryItem(
  itemId: string
): Promise<void> {
  const {
    supabase,
    user,
  } =
    await getAuthenticatedUser();

  const {
    error,
  } =
    await supabase
      .from(
        "grocery_items"
      )
      .delete()
      .eq(
        "id",
        itemId
      )
      .eq(
        "user_id",
        user.id
      );

  if (error) {
    throw new Error(
      error.message
    );
  }
}


/* ============================================================
   Delete Many Grocery Items
============================================================ */

export async function deleteCloudGroceryItems(
  itemIds:
    string[]
): Promise<void> {
  if (
    itemIds.length ===
    0
  ) {
    return;
  }

  const {
    supabase,
    user,
  } =
    await getAuthenticatedUser();

  const {
    error,
  } =
    await supabase
      .from(
        "grocery_items"
      )
      .delete()
      .eq(
        "user_id",
        user.id
      )
      .in(
        "id",
        itemIds
      );

  if (error) {
    throw new Error(
      error.message
    );
  }
}