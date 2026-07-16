import { createClient } from "../utils/supabase/client";

import { ShoppingItem } from "../types/shopping";

type GroceryItemRow = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  quantity: number | string;
  unit: string;
  purchased: boolean;
  notes: string | null;
};

async function getAuthenticatedUser() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
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

function mapGroceryRow(
  row: GroceryItemRow
): ShoppingItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    quantity: `${Number(row.quantity)} ${row.unit}`.trim(),
    purchased: row.purchased,
  };
}

function parseQuantity(quantityText: string) {
  const trimmedQuantity =
    quantityText.trim();

  const parts =
    trimmedQuantity.split(/\s+/);

  const numericQuantity =
    Number(parts[0]);

  const unit =
    parts.slice(1).join(" ").trim() ||
    "pcs";

  if (
    !Number.isFinite(numericQuantity) ||
    numericQuantity <= 0
  ) {
    throw new Error(
      "Grocery quantity must be greater than zero."
    );
  }

  return {
    quantity: numericQuantity,
    unit,
  };
}

export async function loadCloudGrocery(): Promise<
  ShoppingItem[]
> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("grocery_items")
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
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data as GroceryItemRow[]).map(
    mapGroceryRow
  );
}

export async function saveCloudGroceryItem(
  item: ShoppingItem
): Promise<ShoppingItem> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const parsedQuantity =
    parseQuantity(item.quantity);

  const payload = {
    user_id: user.id,
    name: item.name.trim(),
    category: item.category,
    quantity:
      parsedQuantity.quantity,
    unit: parsedQuantity.unit,
    purchased: item.purchased,
  };

  const hasUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      item.id
    );

  let cloudItemExists = false;

  if (hasUuid) {
    const {
      data: existingItem,
      error: checkError,
    } = await supabase
      .from("grocery_items")
      .select("id")
      .eq("id", item.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      throw new Error(
        checkError.message
      );
    }

    cloudItemExists =
      Boolean(existingItem);
  }

  if (cloudItemExists) {
    const {
      data: updatedItem,
      error: updateError,
    } = await supabase
      .from("grocery_items")
      .update(payload)
      .eq("id", item.id)
      .eq("user_id", user.id)
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

  const {
    data: insertedItem,
    error: insertError,
  } = await supabase
    .from("grocery_items")
    .insert(payload)
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

export async function saveCloudGroceryItems(
  items: ShoppingItem[]
): Promise<ShoppingItem[]> {
  return Promise.all(
    items.map((item) =>
      saveCloudGroceryItem(item)
    )
  );
}

export async function deleteCloudGroceryItem(
  itemId: string
): Promise<void> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const { error } = await supabase
    .from("grocery_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteCloudGroceryItems(
  itemIds: string[]
): Promise<void> {
  if (itemIds.length === 0) return;

  const { supabase, user } =
    await getAuthenticatedUser();

  const { error } = await supabase
    .from("grocery_items")
    .delete()
    .eq("user_id", user.id)
    .in("id", itemIds);

  if (error) {
    throw new Error(error.message);
  }
}