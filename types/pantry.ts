export interface PantryItem {
  id: string;

  name: string;

  category: string;

  quantity: number;

  unit: string;

  minQuantity: number;

  expiryDate?: string;

  notes?: string;
}