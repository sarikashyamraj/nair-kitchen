import type {
  InsightSeverity,
  KitchenHealthStatus,
} from "./types";

export const KITCHEN_SCORE_WEIGHTS = {
  pantry: 0.3,
  grocery: 0.2,
  planner: 0.2,
  recipes: 0.15,
  budget: 0.15,
} as const;

export const KITCHEN_HEALTH_THRESHOLDS = {
  excellent: 85,
  good: 70,
  needsAttention: 50,
} as const;

export const INSIGHT_PRIORITY = {
  critical: 100,
  warning: 75,
  info: 50,
  success: 25,
} satisfies Record<InsightSeverity, number>;

export const MAX_DASHBOARD_INSIGHTS = 5;

export const RECIPE_VARIETY_TARGET = 10;

export const DEFAULT_MEAL_SLOT_COUNT = 5;

export const BUDGET_USAGE_THRESHOLDS = {
  warning: 80,
  critical: 100,
} as const;

export function getKitchenHealthStatus(
  score: number
): KitchenHealthStatus {
  if (
    score >=
    KITCHEN_HEALTH_THRESHOLDS.excellent
  ) {
    return "excellent";
  }

  if (
    score >=
    KITCHEN_HEALTH_THRESHOLDS.good
  ) {
    return "good";
  }

  if (
    score >=
    KITCHEN_HEALTH_THRESHOLDS.needsAttention
  ) {
    return "needs-attention";
  }

  return "critical";
}