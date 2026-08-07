import {
  ingredientImages,
} from "./ingredientImages";

import {
  inventoryCategoryImages,
} from "../inventory/inventoryCategoryImages";

export function getIngredientImage(
  ingredient: string,
  category?: string
) {
  const key = ingredient
    .trim()
    .toLowerCase();

  // 1. Use exact item image when available
  const exactImage =
    ingredientImages[key];

  if (exactImage) {
    return exactImage;
  }

  // 2. Otherwise use category image
  if (category) {
    const categoryImage =
      inventoryCategoryImages[
        category as keyof typeof inventoryCategoryImages
      ];

    if (categoryImage) {
      return categoryImage;
    }
  }

  // 3. Final fallback
  return "/ingredients/defaults/unknown.webp";
}