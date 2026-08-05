import type { PantryItem } from "../../types/pantry";
import type { Recipe } from "../../types/recipe";
import type { ShoppingItem } from "../../types/shopping";
import type { MealPlan } from "../../types/planner";

export type InsightCategory =
  | "pantry"
  | "grocery"
  | "planner"
  | "recipes"
  | "budget"
  | "kitchen";

export type InsightSeverity =
  | "success"
  | "info"
  | "warning"
  | "critical";

export type InsightAction = {
  label: string;
  href: string;
};

export type KitchenInsight = {
  id: string;
  category: InsightCategory;
  severity: InsightSeverity;
  
  title: string;
  message: string;
  priority: number;
  action?: InsightAction;
  relatedItemIds?: string[];
};

export type KitchenScoreBreakdown = {
  pantry: number;
  grocery: number;
  planner: number;
  recipes: number;
  budget: number;
};

export type KitchenHealthStatus =
  | "excellent"
  | "good"
  | "needs-attention"
  | "critical";

export type BudgetIntelligenceInput = {
  monthlyBudget: number;
  monthlySpent: number;
  currency: string;
};

export type KitchenIntelligenceInput = {
  pantry: PantryItem[];
  shopping: ShoppingItem[];
  planner: MealPlan[];
  recipes: Recipe[];
  budget?: BudgetIntelligenceInput;
  currentDate?: Date;
};

export type KitchenIntelligenceResult = {
  score: number;
  status: KitchenHealthStatus;
  breakdown: KitchenScoreBreakdown;
  insights: KitchenInsight[];
  generatedAt: string;
};