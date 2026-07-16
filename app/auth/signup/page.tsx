"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import { createClient } from "../../../utils/supabase/client";

export default function SignupPage() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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

  async function handleSignup(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!trimmedEmail) {
      setErrorMessage(
        "Please enter your email address."
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

    const { data, error } =
      await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);

    if (data.session) {
      window.location.href = "/";
      return;
    }

    setSuccessMessage(
      "Account created successfully. Please check your email and confirm your account before signing in."
    );

    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="rounded-3xl border border-[#EADCC4] bg-white p-6 shadow-xl sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C88A22]">
          Create your kitchen
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[#174D2A]">
          Create a Kitchen Brain account
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Start organizing meals, recipes, Pantry
          inventory, Grocery shopping, and household
          budgets in one place.
        </p>
      </div>

      <form
        onSubmit={handleSignup}
        className="mt-8 space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#5A4032]">
            Full name
          </label>

          <div className="relative">
            <UserRound
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter your name"
              autoComplete="name"
              className="w-full rounded-xl border border-[#EADCC4] bg-white py-3 pl-11 pr-4 outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/10"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#5A4032]">
            Email address
          </label>

          <div className="relative">
            <Mail
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-xl border border-[#EADCC4] bg-white py-3 pl-11 pr-4 outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/10"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#5A4032]">
            Password
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
            Confirm password
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
              placeholder="Re-enter your password"
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
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2F6B3C] px-4 font-semibold text-white shadow-sm transition hover:bg-[#255A32] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && (
            <LoaderCircle
              size={18}
              className="animate-spin"
            />
          )}

          {isSubmitting
            ? "Creating account..."
            : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-[#2F6B3C] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}