"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { createClient } from "../../../utils/supabase/client";

export default function LoginPage() {
  const [supabase] = useState(() =>
    createClient()
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [
    isEmailVerificationError,
    setIsEmailVerificationError,
  ] = useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedEmail =
      email.trim().toLowerCase();

    if (!trimmedEmail) {
      setErrorMessage(
        "Please enter your email address."
      );
      return;
    }

    if (!password) {
      setErrorMessage(
        "Please enter your password."
      );
      return;
    }

    setErrorMessage("");
    setIsEmailVerificationError(false);
    setIsSubmitting(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

    if (error) {
      const normalizedMessage =
        error.message.toLowerCase();

      const isUnverifiedEmail =
        normalizedMessage.includes(
          "email not confirmed"
        ) ||
        normalizedMessage.includes(
          "email not verified"
        );

      if (isUnverifiedEmail) {
        setIsEmailVerificationError(true);
        setErrorMessage(
          "Your email address has not been verified. Please open the verification email and click the confirmation link before signing in."
        );
      } else {
        setErrorMessage(error.message);
      }

      setIsSubmitting(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <div className="rounded-3xl border border-[#EADCC4] bg-white p-6 shadow-xl sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C88A22]">
          Welcome back
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[#174D2A]">
          Sign in to Kitchen Brain
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Continue managing your meals, Pantry,
          Grocery list, and household budget.
        </p>
      </div>

      <form
        onSubmit={handleLogin}
        className="mt-8 space-y-5"
      >
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
              onChange={(event) => {
                setEmail(event.target.value);
                setErrorMessage("");
                setIsEmailVerificationError(false);
              }}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-[#EADCC4] bg-white py-3 pl-11 pr-4 outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="text-sm font-semibold text-[#5A4032]">
              Password
            </label>

            <Link
              href="/auth/forgot-password"
              className="text-sm font-semibold text-[#2F6B3C] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <LockKeyhole
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrorMessage("");
                setIsEmailVerificationError(false);
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-[#EADCC4] bg-white py-3 pl-11 pr-12 outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (currentValue) =>
                    !currentValue
                )
              }
              disabled={isSubmitting}
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 transition hover:bg-[#FFF8EC] disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              isEmailVerificationError
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <div className="flex items-start gap-2">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p>{errorMessage}</p>

                {isEmailVerificationError && (
                  <p className="mt-2">
                    Check your Inbox, Spam, or Junk
                    folder for the verification
                    email.
                  </p>
                )}
              </div>
            </div>
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
            ? "Signing in..."
            : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        New to Kitchen Brain?{" "}
        <Link
          href="/auth/signup"
          className="font-semibold text-[#2F6B3C] hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}