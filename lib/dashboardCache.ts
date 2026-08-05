const DASHBOARD_CACHE_KEY =
  "kitchen-brain-dashboard-cache";

const DASHBOARD_CACHE_TTL =
  30 * 1000;

export type DashboardCacheData = {
  pantryItems: number;
  groceryRemaining: number;
  recipesSaved: number;
  mealsPlanned: number;
  kitchenScore: number;

  groceryProgressTotal: number;
  groceryProgressPurchased: number;

  lowStockItems: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
  }[];

  meals: {
    title: string;
    recipeName: string;
    isPlanned: boolean;
  }[];

  monthlyBudget: number;
  monthlySpent: number;
  budgetCurrency: string;
};

type DashboardCacheEntry = {
  data: DashboardCacheData;
  savedAt: number;
};

export function loadDashboardCache():
  | DashboardCacheData
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  const cachedValue =
    localStorage.getItem(
      DASHBOARD_CACHE_KEY
    );

  if (!cachedValue) {
    return null;
  }

  try {
    const parsedValue =
      JSON.parse(
        cachedValue
      ) as DashboardCacheEntry;

    const isExpired =
      Date.now() -
        parsedValue.savedAt >
      DASHBOARD_CACHE_TTL;

    if (isExpired) {
      localStorage.removeItem(
        DASHBOARD_CACHE_KEY
      );

      return null;
    }

    if (
      !parsedValue.data ||
      typeof parsedValue.savedAt !==
        "number"
    ) {
      throw new Error(
        "Invalid Dashboard cache."
      );
    }

    return parsedValue.data;
  } catch {
    localStorage.removeItem(
      DASHBOARD_CACHE_KEY
    );

    return null;
  }
}

export function saveDashboardCache(
  data: DashboardCacheData
) {
  if (typeof window === "undefined") {
    return;
  }

  const cacheEntry: DashboardCacheEntry = {
    data,
    savedAt: Date.now(),
  };

  localStorage.setItem(
    DASHBOARD_CACHE_KEY,
    JSON.stringify(cacheEntry)
  );
}

export function clearDashboardCache() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    DASHBOARD_CACHE_KEY
  );
}