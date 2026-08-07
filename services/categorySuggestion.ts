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
  lettuce: "Vegetables",
  broccoli: "Vegetables",
  beetroot: "Vegetables",
  mushroom: "Vegetables",
  peas: "Vegetables",

  // Fruits
  apple: "Fruits",
  banana: "Fruits",
  orange: "Fruits",
  mango: "Fruits",
  grapes: "Fruits",
  watermelon: "Fruits",
  papaya: "Fruits",
  pineapple: "Fruits",
  strawberry: "Fruits",
  avocado: "Fruits",

  // Dairy
  milk: "Dairy",
  "full fat milk": "Dairy",
  "whole milk": "Dairy",
  "fresh milk": "Dairy",
  paneer: "Dairy",
  butter: "Dairy",
  cheese: "Dairy",
  curd: "Dairy",
  yogurt: "Dairy",
  yoghurt: "Dairy",
  cream: "Dairy",
  ghee: "Dairy",
  eggs: "Dairy",
  egg: "Dairy",

  // Meat
  chicken: "Meat",
  mutton: "Meat",
  beef: "Meat",
  lamb: "Meat",
  turkey: "Meat",

  // Seafood
  fish: "Seafood",
  prawns: "Seafood",
  prawn: "Seafood",
  shrimp: "Seafood",
  salmon: "Seafood",
  tuna: "Seafood",
  sardine: "Seafood",

  // Grains
  rice: "Grains",
  wheat: "Grains",
  flour: "Grains",
  atta: "Grains",
  oats: "Grains",
  pasta: "Grains",
  noodles: "Grains",
  quinoa: "Grains",
  poha: "Grains",
  semolina: "Grains",
  sooji: "Grains",

  // Spices / Condiments
  turmeric: "Spices",
  cumin: "Spices",
  pepper: "Spices",
  cinnamon: "Spices",
  cardamom: "Spices",
  clove: "Spices",
  "chilli powder": "Spices",
  "coriander powder": "Spices",
  "garam masala": "Spices",
  "soy sauce": "Spices",
  "soya sauce": "Spices",
  ketchup: "Spices",
  vinegar: "Spices",
  mustard: "Spices",

  // Snacks
  biscuits: "Snacks",
  biscuit: "Snacks",
  chips: "Snacks",
  cookies: "Snacks",
  crackers: "Snacks",
  chocolate: "Snacks",
  popcorn: "Snacks",

  // Beverages
  tea: "Beverages",
  coffee: "Beverages",
  juice: "Beverages",
  "coconut water": "Beverages",
  "soft drink": "Beverages",
  soda: "Beverages",

  // Frozen
  "frozen peas": "Frozen",
  "frozen vegetables": "Frozen",
  "frozen chicken": "Frozen",
  "frozen fish": "Frozen",
  "frozen fries": "Frozen",
  "ice cream": "Frozen",

  // Bakery
  bread: "Bakery",
  bun: "Bakery",
  buns: "Bakery",
  croissant: "Bakery",
  cake: "Bakery",
  muffin: "Bakery",

  // Household - Dishwashing
  "dish soap": "Household",
  "dish wash": "Household",
  "dishwash liquid": "Household",
  "dishwashing liquid": "Household",
  "dishwasher tablet": "Household",
  "dishwasher tablets": "Household",
  sponge: "Household",
  scrubber: "Household",

  // Household - Laundry
  detergent: "Household",
  "laundry detergent": "Household",
  "washing powder": "Household",
  "washing liquid": "Household",
  "fabric softener": "Household",

  // Household - Cleaning
  "floor cleaner": "Household",
  "toilet cleaner": "Household",
  "glass cleaner": "Household",
  "surface cleaner": "Household",
  disinfectant: "Household",
  bleach: "Household",
  mop: "Household",
  broom: "Household",
  "cleaning cloth": "Household",

  // Household - Paper / Disposable
  tissue: "Household",
  tissues: "Household",
  "toilet paper": "Household",
  "kitchen roll": "Household",
  "paper towel": "Household",
  "paper towels": "Household",
  "garbage bag": "Household",
  "garbage bags": "Household",
  "trash bag": "Household",
  "trash bags": "Household",

  // Household - Kitchen Consumables
  foil: "Household",
  "aluminium foil": "Household",
  "aluminum foil": "Household",
  "cling film": "Household",
  "plastic wrap": "Household",
  "ziplock bag": "Household",
  "ziplock bags": "Household",

  // Household - Personal / Home Essentials
  "hand wash": "Household",
  "hand soap": "Household",
  sanitizer: "Household",
  candle: "Household",
  batteries: "Household",
};

export function suggestCategory(
  itemName: string
): string | null {
  const search = itemName
    .trim()
    .toLowerCase();

  if (!search) {
    return null;
  }

  // 1. Exact match has highest priority
  if (categoryMap[search]) {
    return categoryMap[search];
  }

  // 2. Check longer/more-specific keywords first.
  // This prevents generic words from winning over
  // phrases such as "frozen chicken".
  const keywords = Object.keys(
    categoryMap
  ).sort(
    (a, b) =>
      b.length - a.length
  );

  for (const keyword of keywords) {
    if (
      search.includes(keyword)
    ) {
      return categoryMap[
        keyword
      ];
    }
  }

  return null;
}