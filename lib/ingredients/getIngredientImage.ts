import {
  ingredientImages,
} from "./ingredientImages";

import {
  ingredientImageAliases,
} from "./ingredientImageAliases";

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

  // 1. Exact item image
  const exactImage =
    ingredientImages[key];

  if (exactImage) {
    return exactImage;
  }

  // 2. Check known aliases
  const alias =
    ingredientImageAliases[key];

  if (alias) {
    const aliasImage =
      ingredientImages[alias];

    if (aliasImage) {
      return aliasImage;
    }
  }

  // 3. Category fallback
  if (category) {
    const categoryImage =
      inventoryCategoryImages[
        category as keyof typeof inventoryCategoryImages
      ];

    if (categoryImage) {
      return categoryImage;
    }
  }

  // 4. Final fallback
  return "/ingredients/defaults/unknown.webp";
}