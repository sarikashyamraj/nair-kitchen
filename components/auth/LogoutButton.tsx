"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogOut } from "lucide-react";

import { createClient } from "../../utils/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    const supabase = createClient();

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Unable to sign out:",
        error.message
      );

      setIsLoggingOut(false);
      return;
    }

    router.replace("/auth/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-[#5A4032] transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoggingOut ? (
        <LoaderCircle
          size={20}
          className="animate-spin"
        />
      ) : (
        <LogOut size={20} />
      )}

      <span>
        {isLoggingOut
          ? "Signing out..."
          : "Logout"}
      </span>
    </button>
  );
}