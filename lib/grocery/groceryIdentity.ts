export function normalizeGroceryName(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


export function normalizeGroceryUnit(
  unit: string
): string {
  const normalized =
    unit
      .trim()
      .toLowerCase();

  switch (normalized) {
    case "kg":
    case "kgs":
    case "kilogram":
    case "kilograms":
      return "g";

    case "g":
    case "gm":
    case "gms":
    case "gram":
    case "grams":
      return "g";

    case "l":
    case "lt":
    case "ltr":
    case "litre":
    case "litres":
    case "liter":
    case "liters":
      return "ml";

    case "ml":
    case "millilitre":
    case "millilitres":
    case "milliliter":
    case "milliliters":
      return "ml";

    case "pc":
    case "pcs":
    case "piece":
    case "pieces":
    case "no":
    case "nos":
    case "number":
    case "numbers":
      return "pcs";

    case "tbsp":
    case "tablespoon":
    case "tablespoons":
      return "tbsp";

    case "tsp":
    case "teaspoon":
    case "teaspoons":
      return "tsp";

    case "cup":
    case "cups":
      return "cup";

    case "packet":
    case "packets":
    case "pack":
    case "packs":
      return "packet";

    case "bunch":
    case "bunches":
      return "bunch";

    case "sprig":
    case "sprigs":
      return "sprig";

    default:
      return normalized;
  }
}


export function convertGroceryQuantityToNormalizedUnit(
  quantity: number,
  unit: string
): number {
  const normalized =
    unit
      .trim()
      .toLowerCase();

  switch (normalized) {
    case "kg":
    case "kgs":
    case "kilogram":
    case "kilograms":
      return quantity * 1000;

    case "l":
    case "lt":
    case "ltr":
    case "litre":
    case "litres":
    case "liter":
    case "liters":
      return quantity * 1000;

    default:
      return quantity;
  }
}