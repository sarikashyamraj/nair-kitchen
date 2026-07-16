const LAST_STORE_KEY =
  "nair-kitchen-last-store";

const RECENT_STORES_KEY =
  "nair-kitchen-recent-stores";

const CUSTOM_STORES_KEY =
  "nair-kitchen-custom-stores";

const MAX_RECENT_STORES = 5;

function cleanStoreName(storeName: string) {
  return storeName.trim();
}

function removeDuplicateStores(
  stores: string[]
): string[] {
  const uniqueStores = new Map<string, string>();

  stores.forEach((store) => {
    const cleanedStore = cleanStoreName(store);

    if (!cleanedStore) return;

    const normalizedStore =
      cleanedStore.toLowerCase();

    if (!uniqueStores.has(normalizedStore)) {
      uniqueStores.set(
        normalizedStore,
        cleanedStore
      );
    }
  });

  return Array.from(uniqueStores.values());
}

export function loadLastStore(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return (
    localStorage.getItem(LAST_STORE_KEY) || ""
  );
}

export function saveLastStore(
  storeName: string
) {
  if (typeof window === "undefined") {
    return;
  }

  const cleanedStore =
    cleanStoreName(storeName);

  if (!cleanedStore) {
    return;
  }

  localStorage.setItem(
    LAST_STORE_KEY,
    cleanedStore
  );
}

export function loadRecentStores(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedStores =
      localStorage.getItem(
        RECENT_STORES_KEY
      );

    if (!savedStores) {
      return [];
    }

    const parsedStores =
      JSON.parse(savedStores);

    if (!Array.isArray(parsedStores)) {
      return [];
    }

    return removeDuplicateStores(
      parsedStores.filter(
        (store): store is string =>
          typeof store === "string"
      )
    ).slice(0, MAX_RECENT_STORES);
  } catch {
    return [];
  }
}

export function saveRecentStore(
  storeName: string
) {
  if (typeof window === "undefined") {
    return;
  }

  const cleanedStore =
    cleanStoreName(storeName);

  if (!cleanedStore) {
    return;
  }

  const existingStores =
    loadRecentStores();

  const updatedStores =
    removeDuplicateStores([
      cleanedStore,
      ...existingStores,
    ]).slice(0, MAX_RECENT_STORES);

  localStorage.setItem(
    RECENT_STORES_KEY,
    JSON.stringify(updatedStores)
  );

  saveLastStore(cleanedStore);
}

export function loadCustomStores(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedStores =
      localStorage.getItem(
        CUSTOM_STORES_KEY
      );

    if (!savedStores) {
      return [];
    }

    const parsedStores =
      JSON.parse(savedStores);

    if (!Array.isArray(parsedStores)) {
      return [];
    }

    return removeDuplicateStores(
      parsedStores.filter(
        (store): store is string =>
          typeof store === "string"
      )
    );
  } catch {
    return [];
  }
}

export function saveCustomStore(
  storeName: string
) {
  if (typeof window === "undefined") {
    return;
  }

  const cleanedStore =
    cleanStoreName(storeName);

  if (!cleanedStore) {
    return;
  }

  const existingStores =
    loadCustomStores();

  const updatedStores =
    removeDuplicateStores([
      cleanedStore,
      ...existingStores,
    ]);

  localStorage.setItem(
    CUSTOM_STORES_KEY,
    JSON.stringify(updatedStores)
  );

  saveRecentStore(cleanedStore);
}

export function getCombinedStoreList(
  regionalStores: string[],
  recentStores: string[],
  customStores: string[]
): string[] {
  return removeDuplicateStores([
    ...recentStores,
    ...customStores,
    ...regionalStores,
  ]);
}