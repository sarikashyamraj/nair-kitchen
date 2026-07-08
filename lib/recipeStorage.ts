import { Recipe } from "../types/recipe";

const STORAGE_KEY = "recipes";

export function loadRecipes(): Recipe[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);

  return stored ? JSON.parse(stored) : [];
}

export function saveRecipes(recipes: Recipe[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}