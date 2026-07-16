import {
  FamilyMember,
  UserProfile,
} from "../types/profile";
export const defaultUserProfile: UserProfile = {
  name: "Sarika Nair",
  age: 38,
  gender: "Female",
  role: "Kitchen Admin",
  profileImage: "/profile/sarika-profile.jpg",
};

export const defaultFamilyMembers: FamilyMember[] = [
  {
    id: "1",
    name: "Shyam",
    relationship: "Husband",
    age: 40,
    foodPreference: "Veg & Non-Veg",
    profileImage: "",
  },
  {
    id: "2",
    name: "Anvika",
    relationship: "Daughter",
    age: 9,
    foodPreference: "Veg & Non-Veg",
    profileImage: "",
  },
  {
    id: "3",
    name: "Household Helper",
    relationship: "Household Member",
    foodPreference: "Not specified",
    profileImage: "",
  },
];