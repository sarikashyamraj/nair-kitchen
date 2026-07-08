export function convertToBaseUnit(
  quantity: number,
  unit: string
): number {
  switch (unit.toLowerCase()) {
    case "kg":
      return quantity * 1000;

    case "g":
      return quantity;

    case "l":
      return quantity * 1000;

    case "ml":
      return quantity;

    default:
      return quantity;
  }
}

export function getBaseUnit(unit: string): string {
  switch (unit.toLowerCase()) {
    case "kg":
    case "g":
      return "g";

    case "l":
    case "ml":
      return "ml";

    default:
      return unit;
  }
}