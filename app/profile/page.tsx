"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { uploadProfileImage } from "../../services/profileImageService";
import AppLayout from "../../components/AppLayout";
import ConfirmModal from "../../components/common/ConfirmModal";
import {
  FamilyMember,
  FoodPreference,
  Gender,
  UserProfile,
} from "../../types/profile";

import {
  deleteCloudFamilyMember,
  loadCloudFamilyMembers,
  loadCloudProfile,
  saveCloudFamilyMember,
  saveCloudProfile,
} from "../../services/profileService";

import {
  loadFamilyMembers,
  loadUserProfile,
} from "../../lib/profileStorage";

import { useToast } from "../../context/ToastContext";

import {
  defaultFamilyMembers,
  defaultUserProfile,
} from "../../data/defaultProfile";

type MemberFormData = {
  name: string;
  relationship: string;
  age: string;
  foodPreference: FoodPreference;
  profileImage: string;
};

const emptyMemberForm: MemberFormData = {
  name: "",
  relationship: "",
  age: "",
  foodPreference: "Not specified",
  profileImage: "",
};

export default function ProfilePage() {
  const { showToast } = useToast();
  const [profile, setProfile] =
    useState<UserProfile>(defaultUserProfile);

  const [familyMembers, setFamilyMembers] =
    useState<FamilyMember[]>(defaultFamilyMembers);

  const [isLoaded, setIsLoaded] = useState(false);
const [email, setEmail] = useState("");
const [isSavingProfile, setIsSavingProfile] =
  useState(false);
const [isSavingMember, setIsSavingMember] =
  useState(false);
const [isDeletingMember, setIsDeletingMember] =
  useState(false);
const [loadError, setLoadError] = useState("");
  const [isProfileFormOpen, setIsProfileFormOpen] =
    useState(false);

  const [isMemberFormOpen, setIsMemberFormOpen] =
    useState(false);

  const [editingMember, setEditingMember] =
    useState<FamilyMember | null>(null);

  const [profileForm, setProfileForm] =
    useState<UserProfile>(defaultUserProfile);
const [isUploadingProfileImage, setIsUploadingProfileImage] =
  useState(false);

const [isUploadingMemberImage, setIsUploadingMemberImage] =
  useState(false);
  const [memberForm, setMemberForm] =
    useState<MemberFormData>(emptyMemberForm);
const [memberToDelete, setMemberToDelete] =
  useState<FamilyMember | null>(null);
  useEffect(() => {
  let isMounted = true;

  async function loadProfileData() {
    try {
      setLoadError("");

      const localProfile = loadUserProfile();
      const localMembers = loadFamilyMembers();

      const [
        cloudProfileResult,
        cloudMembersResult,
      ] = await Promise.all([
        loadCloudProfile(),
        loadCloudFamilyMembers(),
      ]);

      if (!isMounted) return;

      let resolvedProfile =
        cloudProfileResult.profile;

      

      let resolvedMembers =
        cloudMembersResult;

      if (
        cloudMembersResult.length === 0 &&
        localMembers.length > 0
      ) {
        resolvedMembers = await Promise.all(
          localMembers.map((member) =>
            saveCloudFamilyMember(member)
          )
        );
      }

      if (!isMounted) return;

      setProfile(resolvedProfile);
      setProfileForm(resolvedProfile);
      setEmail(cloudProfileResult.email);
      setFamilyMembers(resolvedMembers);
    } catch (error) {
      if (!isMounted) return;

      const message =
        error instanceof Error
          ? error.message
          : "Unable to load your profile.";

      setLoadError(message);

      showToast({
        type: "error",
        message,
      });
    } finally {
      if (isMounted) {
        setIsLoaded(true);
      }
    }
  }

  loadProfileData();

  return () => {
    isMounted = false;
  };
}, [showToast]);
async function handleProfilePhotoChange(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) return;

  try {
    setIsUploadingProfileImage(true);

    const imageUrl = await uploadProfileImage(
      file,
      "profile"
    );

    const updatedProfile =
      await saveCloudProfile({
        ...profileForm,
        profileImage: imageUrl,
      });

    setProfile(updatedProfile);
    setProfileForm(updatedProfile);

    window.dispatchEvent(
      new Event("profile-updated")
    );

    showToast({
      type: "success",
      message:
        "Profile photo updated successfully.",
    });
  } catch (error) {
    showToast({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to upload profile photo.",
    });
  } finally {
    setIsUploadingProfileImage(false);
    event.target.value = "";
  }
}
  function openProfileForm() {
    setProfileForm(profile);
    setIsProfileFormOpen(true);
  }

 async function handleSaveProfile() {
  if (!profileForm.name.trim()) {
    showToast({
      type: "warning",
      message: "Please enter your name.",
    });
    return;
  }

  try {
    setIsSavingProfile(true);

    const updatedProfile =
      await saveCloudProfile({
        ...profileForm,
        name: profileForm.name.trim(),
        role:
          profileForm.role.trim() ||
          "Kitchen Manager",
      });

    setProfile(updatedProfile);
    setProfileForm(updatedProfile);

    window.dispatchEvent(
      new Event("profile-updated")
    );

    setIsProfileFormOpen(false);

    showToast({
      type: "success",
      message:
        "Profile updated successfully.",
    });
  } catch (error) {
    showToast({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to update profile.",
    });
  } finally {
    setIsSavingProfile(false);
  }
}

  function openAddMemberForm() {
    setEditingMember(null);
    setMemberForm(emptyMemberForm);
    setIsMemberFormOpen(true);
  }

  function openEditMemberForm(member: FamilyMember) {
  setEditingMember(member);

  setMemberForm({
    name: member.name,
    relationship: member.relationship,
    age: member.age ? String(member.age) : "",
    foodPreference: member.foodPreference,
    profileImage: member.profileImage || "",
  });

  setIsMemberFormOpen(true);
}
async function handleMemberPhotoChange(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) return;

  try {
    setIsUploadingMemberImage(true);

    const imageUrl = await uploadProfileImage(
      file,
      "family",
      editingMember?.id
    );

    setMemberForm((currentForm) => ({
      ...currentForm,
      profileImage: imageUrl,
    }));

    showToast({
      type: "success",
      message: editingMember
        ? "Photo uploaded. Click Update Member to save the change."
        : "Photo uploaded. Complete the details and click Add Member.",
    });
  } catch (error) {
    showToast({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to upload family member photo.",
    });
  } finally {
    setIsUploadingMemberImage(false);
    event.target.value = "";
  }
}
  async function handleSaveMember() {
  if (
    !memberForm.name.trim() ||
    !memberForm.relationship.trim()
  ) {
    showToast({
      type: "warning",
      message:
        "Please enter the member name and relationship.",
    });
    return;
  }

  const memberToSave: FamilyMember = {
    id:
      editingMember?.id ||
      crypto.randomUUID(),
    name: memberForm.name.trim(),
    relationship:
      memberForm.relationship.trim(),
    age: memberForm.age
      ? Number(memberForm.age)
      : undefined,
    foodPreference:
      memberForm.foodPreference,
    profileImage:
      memberForm.profileImage,
  };

  try {
    setIsSavingMember(true);

    const savedMember =
      await saveCloudFamilyMember(
        memberToSave
      );

    setFamilyMembers(
      (currentMembers) => {
        if (editingMember) {
          return currentMembers.map(
            (member) =>
              member.id === editingMember.id
                ? savedMember
                : member
          );
        }

        return [
          ...currentMembers,
          savedMember,
        ];
      }
    );

    setEditingMember(null);
    setMemberForm(emptyMemberForm);
    setIsMemberFormOpen(false);

    showToast({
      type: "success",
      message: editingMember
        ? "Family member updated."
        : "Family member added.",
    });
  } catch (error) {
    showToast({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to save family member.",
    });
  } finally {
    setIsSavingMember(false);
  }
}

  function handleDeleteMember(member: FamilyMember) {
  setMemberToDelete(member);
}

  return (
  <AppLayout>
    {!isLoaded ? (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-semibold text-[#2F6B3C]">
          Loading your profile...
        </p>
      </div>
    ) : loadError ? (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
        {loadError}
      </div>
    ) : (
      <div className="space-y-6">
        {/* Main Profile */}
        <section className="rounded-2xl border border-[#EADCC4] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-[#2F6B3C]">
              My Profile
            </h1>

            <button
              type="button"
              onClick={openProfileForm}
              className="rounded-xl border border-[#EADCC4] bg-[#FFF8EC] px-4 py-2 text-sm font-semibold text-[#5A4032]"
            >
              ✏️ Edit Profile
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-[#D89B3C] bg-[#F4E8D0] shadow-sm">
              <Image
  src={profile.profileImage}
  alt={`${profile.name} profile`}
  fill
  sizes="96px"
  className="object-cover object-[65%_35%]"
  priority
/>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#5A4032]">
                {profile.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {profile.role}
              </p>
              {email && (
  <p className="mt-1 text-sm text-gray-500">
    {email}
  </p>
)}

              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-[#FFF4DD] px-3 py-1 text-[#8A5A00]">
                  {profile.age} years
                </span>

                <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">
                  {profile.gender}
                </span>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                  Family of {familyMembers.length + 1}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Family Members */}
        <section className="rounded-2xl border border-[#EADCC4] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#2F6B3C]">
                Family Members
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                People included in meal planning.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddMemberForm}
              className="rounded-xl bg-[#2F6B3C] px-4 py-2 text-sm font-semibold text-white"
            >
              + Add Member
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {familyMembers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#EADCC4] p-6 text-center text-sm text-gray-500">
                No family members added yet.
              </div>
            ) : (
              familyMembers.map((member) => (
                <article
                  key={member.id}
                  className="rounded-xl border border-[#F4E8D0] bg-[#FFFCF8] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
  <div className="flex min-w-0 items-start gap-3">
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-[#D89B3C] bg-[#F4E8D0]">
      {member.profileImage ? (
        <Image
          src={member.profileImage}
          alt={`${member.name} profile`}
          fill
          sizes="48px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-bold text-[#2F6B3C]">
          {member.name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>

    <div>
      <h3 className="font-bold text-[#2F6B3C]">
        {member.name}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {member.relationship}
        {member.age ? ` • ${member.age} years` : ""}
      </p>

      <p className="mt-2 text-sm text-[#5A4032]">
        {member.foodPreference}
      </p>
    </div>
  </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditMemberForm(member)
                        }
                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteMember(member)
                        }
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Edit Profile Modal */}
        {isProfileFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
              <h2 className="text-2xl font-bold text-[#2F6B3C]">
                Edit Profile
              </h2>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5A4032]">
                    <div>
  <label className="mb-2 block text-sm font-medium text-[#5A4032]">
    Profile Photo
  </label>

  <div className="flex items-center gap-4">
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-3 border-[#D89B3C] bg-[#F4E8D0]">
      {profileForm.profileImage ? (
        <Image
          src={profileForm.profileImage}
          alt="Profile photo preview"
          fill
          sizes="80px"
          className="object-cover"
        />
      ) : (
        <span className="text-2xl font-bold text-[#2F6B3C]">
          {profileForm.name
            ? profileForm.name.charAt(0).toUpperCase()
            : "?"}
        </span>
      )}
    </div>

    <div>
      <label className="inline-flex cursor-pointer items-center rounded-xl border border-[#D89B3C] bg-[#FFF8EC] px-4 py-2 text-sm font-semibold text-[#8A5A00] transition hover:bg-[#FFF4DD]">
        📷 Choose Photo

        <input
  type="file"
  accept="image/*"
  onChange={handleProfilePhotoChange}
  disabled={isUploadingProfileImage}
  className="hidden"
/>
      </label>

      <p className="mt-2 text-xs text-gray-500">
        Select a photo from your gallery or computer.
      </p>
    </div>
  </div>
</div>
                    Name
                  </label>

                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(event) =>
                      setProfileForm({
                        ...profileForm,
                        name: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#EADCC4] px-4 py-3 outline-none focus:border-[#2F6B3C]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5A4032]">
                    Age
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={profileForm.age}
                    onChange={(event) =>
                      setProfileForm({
                        ...profileForm,
                        age:
                          Number(event.target.value) ||
                          0,
                      })
                    }
                    className="w-full rounded-xl border border-[#EADCC4] px-4 py-3 outline-none focus:border-[#2F6B3C]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5A4032]">
                    Gender
                  </label>

                  <select
                    value={profileForm.gender}
                    onChange={(event) =>
                      setProfileForm({
                        ...profileForm,
                        gender:
                          event.target.value as Gender,
                      })
                    }
                    className="w-full rounded-xl border border-[#EADCC4] bg-white px-4 py-3 outline-none focus:border-[#2F6B3C]"
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5A4032]">
                    Role
                  </label>

                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(event) =>
                      setProfileForm({
                        ...profileForm,
                        role: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-[#EADCC4] px-4 py-3 outline-none focus:border-[#2F6B3C]"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setIsProfileFormOpen(false)
                  }
                  className="rounded-xl border border-[#EADCC4] px-4 py-2 font-semibold text-[#5A4032]"
                >
                  Cancel
                </button>

                <button
  type="button"
  onClick={handleSaveProfile}
  disabled={isSavingProfile}
  className="rounded-xl bg-[#2F6B3C] px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
>
  {isSavingProfile
    ? "Saving..."
    : "Save Profile"}
</button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Family Member Modal */}
        {isMemberFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
              <h2 className="text-2xl font-bold text-[#2F6B3C]">
                {editingMember
                  ? "Edit Family Member"
                  : "Add Family Member"}
              </h2>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5A4032]">
                    Name
                  </label>

                  <input
                    type="text"
                    value={memberForm.name}
                    onChange={(event) =>
                      setMemberForm({
                        ...memberForm,
                        name: event.target.value,
                      })
                    }
                    placeholder="Family member name"
                    className="w-full rounded-xl border border-[#EADCC4] px-4 py-3 outline-none focus:border-[#2F6B3C]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5A4032]">
                    Relationship
                  </label>

                  <input
                    type="text"
                    value={memberForm.relationship}
                    onChange={(event) =>
                      setMemberForm({
                        ...memberForm,
                        relationship:
                          event.target.value,
                      })
                    }
                    placeholder="Husband, Daughter..."
                    className="w-full rounded-xl border border-[#EADCC4] px-4 py-3 outline-none focus:border-[#2F6B3C]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5A4032]">
                    Age
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={memberForm.age}
                    onChange={(event) =>
                      setMemberForm({
                        ...memberForm,
                        age: event.target.value,
                      })
                    }
                    placeholder="Optional"
                    className="w-full rounded-xl border border-[#EADCC4] px-4 py-3 outline-none focus:border-[#2F6B3C]"
                  />
                </div>
<div>
  <label className="mb-2 block text-sm font-medium text-[#5A4032]">
    Profile Photo
  </label>

  <div className="flex items-center gap-4">
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#D89B3C] bg-[#F4E8D0]">
      {memberForm.profileImage ? (
        <Image
          src={memberForm.profileImage}
          alt="Family member preview"
          fill
          sizes="64px"
          className="object-cover"
        />
      ) : (
        <span className="text-xl font-bold text-[#2F6B3C]">
          {memberForm.name
            ? memberForm.name.charAt(0).toUpperCase()
            : "?"}
        </span>
      )}
    </div>

    <div>
      <label
  className={`inline-flex items-center rounded-xl border border-[#D89B3C] bg-[#FFF8EC] px-4 py-2 text-sm font-semibold text-[#8A5A00] transition ${
    isUploadingMemberImage
      ? "cursor-not-allowed opacity-60"
      : "cursor-pointer hover:bg-[#FFF4DD]"
  }`}
>
  {isUploadingMemberImage
    ? "Uploading..."
    : "📷 Choose Photo"}

  <input
    type="file"
    accept="image/*"
    onChange={handleMemberPhotoChange}
    disabled={isUploadingMemberImage}
    className="hidden"
  />
</label>

      <p className="mt-2 text-xs text-gray-500">
        Select a photo from your gallery or computer.
      </p>
    </div>
  </div>
</div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5A4032]">
                    Food Preference
                  </label>

                  <select
                    value={
                      memberForm.foodPreference
                    }
                    onChange={(event) =>
                      setMemberForm({
                        ...memberForm,
                        foodPreference:
                          event.target
                            .value as FoodPreference,
                      })
                    }
                    className="w-full rounded-xl border border-[#EADCC4] bg-white px-4 py-3 outline-none focus:border-[#2F6B3C]"
                  >
                    <option>Vegetarian</option>
<option>Non-Vegetarian</option>
<option>Veg & Non-Veg</option>
<option>Vegan</option>
<option>Not specified</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingMember(null);
                    setMemberForm(emptyMemberForm);
                    setIsMemberFormOpen(false);
                  }}
                  className="rounded-xl border border-[#EADCC4] px-4 py-2 font-semibold text-[#5A4032]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveMember}
                  className="rounded-xl bg-[#2F6B3C] px-4 py-2 font-semibold text-white"
                >
                  {editingMember
                    ? "Update Member"
                    : "Add Member"}
                </button>
              </div>
            </div>
          </div>
        )}
        <ConfirmModal
  isOpen={memberToDelete !== null}
  title="Delete Family Member"
  message={
    memberToDelete
      ? `Are you sure you want to delete "${memberToDelete.name}" from the family profile?`
      : ""
  }
  confirmText="Delete"
  cancelText="Cancel"
  onCancel={() => setMemberToDelete(null)}
  onConfirm={async () => {
  if (!memberToDelete) return;

  try {
    setIsDeletingMember(true);

    await deleteCloudFamilyMember(
      memberToDelete.id
    );

    setFamilyMembers(
      (currentMembers) =>
        currentMembers.filter(
          (member) =>
            member.id !== memberToDelete.id
        )
    );

    setMemberToDelete(null);

    showToast({
      type: "success",
      message: "Family member deleted.",
    });
  } catch (error) {
    showToast({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete family member.",
    });
  } finally {
    setIsDeletingMember(false);
  }
}}
/>
      
            </div>
    )}
  </AppLayout>
);
}