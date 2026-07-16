import { createClient } from "../utils/supabase/client";

import { PantryItem } from "../types/pantry";

type PantryRow = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  quantity: number | string;
  unit: string;
  minimum_stock: number | string;
  notes: string | null;
};

function mapPantryRow(
  row: PantryRow
): PantryItem {
  const quantity = Number(row.quantity);
  const minQuantity = Number(
    row.minimum_stock
  );

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    quantity,
    unit: row.unit,
    minQuantity,
    notes: row.notes || "",
  };
}

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
      "You must be signed in to access Pantry."
    );
  }

  return {
    supabase,
    user,
  };
}

export async function loadCloudPantry(): Promise<
  PantryItem[]
> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("pantry_items")
    .select(
      `
        id,
        user_id,
        name,
        category,
        quantity,
        unit,
        minimum_stock,
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

  return (data as PantryRow[]).map(
    mapPantryRow
  );
}

export async function saveCloudPantryItem(
  item: PantryItem
): Promise<PantryItem> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const payload = {
    user_id: user.id,
    name: item.name.trim(),
    category: item.category,
    quantity: item.quantity,
    unit: item.unit,
    minimum_stock:
      item.minQuantity ?? 0,
    notes:
      item.notes?.trim() || null,
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
      .from("pantry_items")
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
      .from("pantry_items")
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
          minimum_stock,
          notes
        `
      )
      .single();

    if (updateError) {
      throw new Error(
        updateError.message
      );
    }

    return mapPantryRow(
      updatedItem as PantryRow
    );
  }

  const {
    data: insertedItem,
    error: insertError,
  } = await supabase
    .from("pantry_items")
    .insert(payload)
    .select(
      `
        id,
        user_id,
        name,
        category,
        quantity,
        unit,
        minimum_stock,
        notes
      `
    )
    .single();

  if (insertError) {
    throw new Error(
      insertError.message
    );
  }

  return mapPantryRow(
    insertedItem as PantryRow
  );
}

export async function deleteCloudPantryItem(
  itemId: string
): Promise<void> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const { error } = await supabase
    .from("pantry_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}