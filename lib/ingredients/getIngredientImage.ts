import {
  ingredientImages,
} from "./ingredientImages";

import {
  inventoryCategoryImages,
} from "../inventory/inventoryCategoryImages";

const ingredientAliases: Record<
  string,
  string
> = {
  // Milk
  "full fat milk": "milk",
  "whole milk": "milk",
  "fresh milk": "milk",
  "cow milk": "milk",

  // Eggs
  "egg": "eggs",
  "brown eggs": "eggs",
  "white eggs": "eggs",

  // Tomato
  "tomatoes": "tomato",

  // Beans
  "green beans": "beans",

  // Chicken
  "chicken breast": "chicken",
  "chicken thighs": "chicken",

  // Paneer
  "cottage cheese": "paneer",

  // Oats
  "rolled oats": "oats",
  "instant oats": "oats",

  // Rice
  "basmati rice": "rice",
  "white rice": "rice",
  "brown rice": "rice",

  // Soy sauce
  "dark soy sauce":
    "soy sauce",
  "light soy sauce":
    "soy sauce",
};

export function getIngredientImage(
  ingredient: string,
  category?: string
) {
  const normalizedName =
    ingredient
      .trim()
      .toLowerCase();

  const resolvedName =
    ingredientAliases[
      normalizedName
    ] ??
    normalizedName;

  const exactImage =
    ingredientImages[
      resolvedName
    ];

  if (exactImage) {
    return exactImage;
  }

  if (category) {
    const categoryImage =
      inventoryCategoryImages[
        category as keyof typeof inventoryCategoryImages
      ];

    if (categoryImage) {
      return categoryImage;
    }
  }

  return "/ingredients/defaults/unknown.webp";
}