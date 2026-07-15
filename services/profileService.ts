import { createClient } from "../utils/supabase/client";

import {
  FamilyMember,
  UserProfile,
} from "../types/profile";

type ProfileRow = {
  id: string;
  full_name: string | null;
  role: string | null;
  avatar_url: string | null;
  age: number | null;
  gender: string | null;
};

type FamilyMemberRow = {
  id: string;
  user_id: string;
  name: string;
  relationship: string;
  age: number | null;
  food_preference: string;
  profile_image: string | null;
};

async function getAuthenticatedUserId() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error(
      "You must be signed in to access profile information."
    );
  }

  return {
    supabase,
    user,
  };
}

function mapProfileRowToUserProfile(
  row: ProfileRow,
  email: string
): UserProfile {
  return {
    name: row.full_name || email.split("@")[0],
    role: row.role || "Kitchen Manager",
    age: row.age || 0,
    gender:
      (row.gender as UserProfile["gender"]) ||
      "Prefer not to say",
    profileImage: row.avatar_url || "",
  };
}

function mapFamilyMemberRow(
  row: FamilyMemberRow
): FamilyMember {
  return {
    id: row.id,
    name: row.name,
    relationship: row.relationship,
    age: row.age ?? undefined,
    foodPreference:
      row.food_preference as FamilyMember["foodPreference"],
    profileImage: row.profile_image || "",
  };
}

export async function loadCloudProfile(): Promise<{
  profile: UserProfile;
  email: string;
}> {
  const { supabase, user } =
    await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
        id,
        full_name,
        role,
        avatar_url,
        age,
        gender
      `
    )
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const profile = mapProfileRowToUserProfile(
    data as ProfileRow,
    user.email || ""
  );

  return {
    profile,
    email: user.email || "",
  };
}

export async function saveCloudProfile(
  profile: UserProfile
): Promise<UserProfile> {
  const { supabase, user } =
    await getAuthenticatedUserId();

  const cleanedName = profile.name.trim();
  const cleanedRole =
    profile.role.trim() || "Kitchen Manager";

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        full_name: cleanedName,
        role: cleanedRole,
        avatar_url:
          profile.profileImage || null,
        age:
          profile.age && profile.age > 0
            ? profile.age
            : null,
        gender:
          profile.gender ||
          "Prefer not to say",
      },
      {
        onConflict: "id",
      }
    )
    .select(
      `
        id,
        full_name,
        role,
        avatar_url,
        age,
        gender
      `
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const { error: metadataError } =
    await supabase.auth.updateUser({
      data: {
        full_name: cleanedName,
      },
    });

  if (metadataError) {
    console.warn(
      "Profile saved, but authentication metadata could not be updated:",
      metadataError.message
    );
  }

  return mapProfileRowToUserProfile(
    data as ProfileRow,
    user.email || ""
  );
}

export async function loadCloudFamilyMembers(): Promise<
  FamilyMember[]
> {
  const { supabase, user } =
    await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("family_members")
    .select(
      `
        id,
        user_id,
        name,
        relationship,
        age,
        food_preference,
        profile_image
      `
    )
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data as FamilyMemberRow[]).map(
    mapFamilyMemberRow
  );
}

export async function saveCloudFamilyMember(
  member: FamilyMember
): Promise<FamilyMember> {
  const { supabase, user } =
    await getAuthenticatedUserId();

  const payload = {
    user_id: user.id,
    name: member.name.trim(),
    relationship:
      member.relationship.trim(),
    age:
      member.age && member.age > 0
        ? member.age
        : null,
    food_preference:
      member.foodPreference ||
      "Not specified",
    profile_image:
      member.profileImage || null,
  };

  const isExistingCloudMember =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      member.id
    );

  if (isExistingCloudMember) {
    const { data, error } = await supabase
      .from("family_members")
      .update(payload)
      .eq("id", member.id)
      .eq("user_id", user.id)
      .select(
        `
          id,
          user_id,
          name,
          relationship,
          age,
          food_preference,
          profile_image
        `
      )
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapFamilyMemberRow(
      data as FamilyMemberRow
    );
  }

  const { data, error } = await supabase
    .from("family_members")
    .insert(payload)
    .select(
      `
        id,
        user_id,
        name,
        relationship,
        age,
        food_preference,
        profile_image
      `
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapFamilyMemberRow(
    data as FamilyMemberRow
  );
}

export async function deleteCloudFamilyMember(
  memberId: string
): Promise<void> {
  const { supabase, user } =
    await getAuthenticatedUserId();

  const { error } = await supabase
    .from("family_members")
    .delete()
    .eq("id", memberId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}