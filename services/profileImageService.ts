import { createClient } from "../utils/supabase/client";

const PROFILE_IMAGE_BUCKET = "profile-images";

function getFileExtension(file: File) {
  const extension = file.name
    .split(".")
    .pop()
    ?.toLowerCase();

  if (extension) {
    return extension;
  }

  const mimeExtension =
    file.type.split("/").pop();

  return mimeExtension || "jpg";
}

function createSafeFileName(
  file: File,
  imageType: "profile" | "family",
  entityId?: string
) {
  const extension = getFileExtension(file);

  const uniquePart =
    entityId || crypto.randomUUID();

  return `${imageType}-${uniquePart}-${Date.now()}.${extension}`;
}

export async function uploadProfileImage(
  file: File,
  imageType: "profile" | "family",
  entityId?: string
): Promise<string> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error(
      "You must be signed in to upload a profile image."
    );
  }

  if (!file.type.startsWith("image/")) {
    throw new Error(
      "Please select a valid image file."
    );
  }

  const maximumFileSize =
    5 * 1024 * 1024;

  if (file.size > maximumFileSize) {
    throw new Error(
      "The selected image must be smaller than 5 MB."
    );
  }

  const fileName = createSafeFileName(
    file,
    imageType,
    entityId
  );

  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } =
    await supabase.storage
      .from(PROFILE_IMAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from(PROFILE_IMAGE_BUCKET)
    .getPublicUrl(filePath);

  if (!publicUrl) {
    throw new Error(
      "The uploaded image URL could not be created."
    );
  }

  return publicUrl;
}