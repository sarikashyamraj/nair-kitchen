import { FamilyMember, UserProfile } from "../types/profile";
import {
  defaultFamilyMembers,
  defaultUserProfile,
} from "../data/defaultProfile";

const PROFILE_KEY = "nair-kitchen-user-profile";
const FAMILY_KEY = "nair-kitchen-family-members";

export function loadUserProfile(): UserProfile {
  if (typeof window === "undefined") {
    return defaultUserProfile;
  }

  try {
    const savedProfile = localStorage.getItem(PROFILE_KEY);

    return savedProfile
      ? JSON.parse(savedProfile)
      : defaultUserProfile;
  } catch {
    return defaultUserProfile;
  }
}

export function saveUserProfile(profile: UserProfile) {
  if (typeof window === "undefined") return;

  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadFamilyMembers(): FamilyMember[] {
  if (typeof window === "undefined") {
    return defaultFamilyMembers;
  }

  try {
    const savedMembers = localStorage.getItem(FAMILY_KEY);

    return savedMembers
      ? JSON.parse(savedMembers)
      : defaultFamilyMembers;
  } catch {
    return defaultFamilyMembers;
  }
}

export function saveFamilyMembers(members: FamilyMember[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(FAMILY_KEY, JSON.stringify(members));
}