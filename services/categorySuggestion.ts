const categoryMap: Record<string, string> = {
  // Vegetables
  tomato: "Vegetables",
  onion: "Vegetables",
  potato: "Vegetables",
  carrot: "Vegetables",
  beans: "Vegetables",
  cabbage: "Vegetables",
  cauliflower: "Vegetables",
  cucumber: "Vegetables",
  capsicum: "Vegetables",
  spinach: "Vegetables",
  coriander: "Vegetables",
  mint: "Vegetables",
  ginger: "Vegetables",
  garlic: "Vegetables",
  chilli: "Vegetables",
  lemon: "Vegetables",

  // Fruits
  apple: "Fruits",
  banana: "Fruits",
  orange: "Fruits",
  mango: "Fruits",
  grapes: "Fruits",
  watermelon: "Fruits",
  papaya: "Fruits",

  // Dairy
  milk: "Dairy",
  paneer: "Dairy",
  butter: "Dairy",
  cheese: "Dairy",
  curd: "Dairy",
  yogurt: "Dairy",
  cream: "Dairy",
  ghee: "Dairy",

  // Meat
  chicken: "Meat",
  mutton: "Meat",
  beef: "Meat",

  // Seafood
  fish: "Seafood",
  prawns: "Seafood",
  shrimp: "Seafood",

  // Grains
  rice: "Grains",
  wheat: "Grains",
  flour: "Grains",
  oats: "Grains",
  pasta: "Grains",

  // Spices
  "turmeric": "Spices",
  "cumin": "Spices",
  "pepper": "Spices",
  "cinnamon": "Spices",
  "cardamom": "Spices",
  "clove": "Spices",
  "chilli powder": "Spices",
  "coriander powder": "Spices",

  // Snacks
  "biscuits": "Snacks",
  "chips": "Snacks",

  // Household
  "detergent": "Household",
  "tissue": "Household",
  "foil": "Household",
  "cling film": "Household",
};

export function suggestCategory(itemName: string): string | null {
  const search = itemName.trim().toLowerCase();

  // Exact match first
  if (categoryMap[search]) {
    return categoryMap[search];
  }

  // Partial keyword match
  for (const keyword of Object.keys(categoryMap)) {
    if (search.includes(keyword)) {
      return categoryMap[keyword];
    }
  }

  return null;
}