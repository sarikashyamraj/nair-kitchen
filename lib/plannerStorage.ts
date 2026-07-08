import { MealPlan } from "../types/planner";

const STORAGE_KEY = "meal-planner";

export function loadPlanner(): MealPlan[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);

  return stored ? JSON.parse(stored) : [];
}

export function savePlanner(plans: MealPlan[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}