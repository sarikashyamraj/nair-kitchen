import { createClient } from "../utils/supabase/client";

import {
  MealType,
  Recipe,
  RecipeIngredient,
} from "../types/recipe";

type RecipeRow = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  meal_types: string[];
  cooking_time: string | null;
  instructions: string | null;
  created_at?: string;
  recipe_ingredients?: RecipeIngredientRow[];
};

type RecipeIngredientRow = {
  id: string;
  recipe_id: string;
  user_id: string;
  name: string;
  quantity: number | string;
  unit: string;
  category: string | null;
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
      "You must be signed in to access Recipes."
    );
  }

  return {
    supabase,
    user,
  };
}

function mapIngredientRow(
  row: RecipeIngredientRow
): RecipeIngredient {
  return {
    name: row.name,
    quantity: Number(row.quantity),
    unit: row.unit,
  };
}

function mapRecipeRow(
  row: RecipeRow
): Recipe {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    mealTypes:
      (row.meal_types || ["Lunch"]) as MealType[],
    cookingTime: row.cooking_time || "",
    instructions: row.instructions || "",
    ingredients:
      row.recipe_ingredients?.map(
        mapIngredientRow
      ) || [],
  };
}

export async function loadCloudRecipes(): Promise<
  Recipe[]
> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("recipes")
    .select(
      `
        id,
        user_id,
        name,
        category,
        meal_types,
        cooking_time,
        instructions,
        created_at,
        recipe_ingredients (
          id,
          recipe_id,
          user_id,
          name,
          quantity,
          unit,
          category
        )
      `
    )
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data as RecipeRow[]).map(
    mapRecipeRow
  );
}

async function replaceRecipeIngredients(
  recipeId: string,
  userId: string,
  ingredients: RecipeIngredient[]
): Promise<void> {
  const supabase = createClient();

  const { error: deleteError } =
    await supabase
      .from("recipe_ingredients")
      .delete()
      .eq("recipe_id", recipeId)
      .eq("user_id", userId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (ingredients.length === 0) {
    return;
  }

  const ingredientRows = ingredients.map(
    (ingredient) => ({
      recipe_id: recipeId,
      user_id: userId,
      name: ingredient.name.trim(),
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      category: null,
    })
  );

  const { error: insertError } =
    await supabase
      .from("recipe_ingredients")
      .insert(ingredientRows);

  if (insertError) {
    throw new Error(insertError.message);
  }
}

export async function saveCloudRecipe(
  recipe: Recipe
): Promise<Recipe> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const recipePayload = {
    user_id: user.id,
    name: recipe.name.trim(),
    category: recipe.category,
    meal_types: recipe.mealTypes,
    cooking_time:
      recipe.cookingTime.trim() || null,
    instructions:
      recipe.instructions.trim() || null,
  };

  const hasUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      recipe.id
    );

  let cloudRecipeExists = false;

  if (hasUuid) {
    const {
      data: existingRecipe,
      error: checkError,
    } = await supabase
      .from("recipes")
      .select("id")
      .eq("id", recipe.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      throw new Error(checkError.message);
    }

    cloudRecipeExists =
      Boolean(existingRecipe);
  }

  let recipeId: string;

  if (cloudRecipeExists) {
    const {
      data: updatedRecipe,
      error: updateError,
    } = await supabase
      .from("recipes")
      .update(recipePayload)
      .eq("id", recipe.id)
      .eq("user_id", user.id)
      .select("id")
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    recipeId = updatedRecipe.id;
  } else {
    const {
      data: insertedRecipe,
      error: insertError,
    } = await supabase
      .from("recipes")
      .insert(recipePayload)
      .select("id")
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    recipeId = insertedRecipe.id;
  }

  await replaceRecipeIngredients(
    recipeId,
    user.id,
    recipe.ingredients
  );

  const {
    data: savedRecipe,
    error: loadError,
  } = await supabase
    .from("recipes")
    .select(
      `
        id,
        user_id,
        name,
        category,
        meal_types,
        cooking_time,
        instructions,
        recipe_ingredients (
          id,
          recipe_id,
          user_id,
          name,
          quantity,
          unit,
          category
        )
      `
    )
    .eq("id", recipeId)
    .eq("user_id", user.id)
    .single();

  if (loadError) {
    throw new Error(loadError.message);
  }

  return mapRecipeRow(
    savedRecipe as RecipeRow
  );
}

export async function deleteCloudRecipe(
  recipeId: string
): Promise<void> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", recipeId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}