export type Gender =
  | "Female"
  | "Male"
  | "Other"
  | "Prefer not to say";

export type FoodPreference =
  | "Vegetarian"
  | "Non-Vegetarian"
  | "Veg & Non-Veg"
  | "Vegan"
  | "Not specified";

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  role: string;
  profileImage: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age?: number;
  foodPreference: FoodPreference;
  profileImage?: string;
}