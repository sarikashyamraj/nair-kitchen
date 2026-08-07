import { ingredientImages } from "./ingredientImages";

export function getIngredientImage(
  ingredient: string
) {
  const key = ingredient
    .trim()
    .toLowerCase();

  return (
    ingredientImages[key] ??
    "/ingredients/defaults/unknown.webp"
  );
}