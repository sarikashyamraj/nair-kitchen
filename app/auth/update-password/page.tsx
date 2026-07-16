"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";

import { createClient } from "../../../utils/supabase/client";

export default function UpdatePasswordPage() {
  const [supabase] = useState(() =>
  createClient()
);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);
const [isSessionReady, setIsSessionReady] =
  useState(false);
useEffect(() => {
  let isMounted = true;

  async function verifyRecoverySession() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!isMounted) return;

    if (error || !user) {
      setErrorMessage(
        "The password-reset link is invalid or has expired. Please request a new reset link."
      );
      setIsSessionReady(false);
      return;
    }

    setErrorMessage("");
    setIsSessionReady(true);
  }

  void verifyRecoverySession();

  return () => {
    isMounted = false;
  };
}, [supabase]);
  async function handleUpdatePassword(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    if (!isSessionReady) {
  setErrorMessage(
    "Your password-reset session is not ready. Please request a new reset link."
  );
  return;
}

    if (password.length < 8) {
      setErrorMessage(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        "The passwords do not match."
      );
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage(
      "Your password has been updated successfully."
    );

    setPassword("");
    setConfirmPassword("");
    setIsSubmitting(false);
  }

  return (
    <div className="rounded-3xl border border-[#EADCC4] bg-white p-6 shadow-xl sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C88A22]">
          Secure your account
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[#174D2A]">
          Create a new password
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Choose a strong password for your Kitchen Brain account.
        </p>
      </div>

      <form
        onSubmit={handleUpdatePassword}
        className="mt-8 space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#5A4032]">
            New password
          </label>

          <div className="relative">
            <LockKeyhole
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className="w-full rounded-xl border border-[#EADCC4] bg-white py-3 pl-11 pr-12 outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/10"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (currentValue) => !currentValue
                )
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 transition hover:bg-[#FFF8EC]"
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#5A4032]">
            Confirm new password
          </label>

          <div className="relative">
            <LockKeyhole
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              className="w-full rounded-xl border border-[#EADCC4] bg-white py-3 pl-11 pr-12 outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/10"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (currentValue) => !currentValue
                )
              }
              aria-label={
                showConfirmPassword
                  ? "Hide password"
                  : "Show password"
              }
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 transition hover:bg-[#FFF8EC]"
            >
              {showConfirmPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <div className="flex items-start gap-2">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p>{successMessage}</p>

                <Link
                  href="/auth/login"
                  className="mt-2 inline-block font-semibold text-[#2F6B3C] hover:underline"
                >
                  Return to sign in
                </Link>
              </div>
            </div>
          </div>
        )}

        <button
  type="submit"
  disabled={
    isSubmitting ||
    !isSessionReady
  }
  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2F6B3C] px-4 font-semibold text-white shadow-sm transition hover:bg-[#255A32] disabled:cursor-not-allowed disabled:opacity-60"
>
  {isSubmitting && (
    <LoaderCircle
      size={18}
      className="animate-spin"
    />
  )}

  {!isSessionReady
    ? "Verifying Reset Link..."
    : isSubmitting
    ? "Updating password..."
    : "Update Password"}
</button>
      </form>
    </div>
  );
}