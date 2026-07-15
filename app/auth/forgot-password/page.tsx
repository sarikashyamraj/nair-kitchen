"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  LoaderCircle,
  Mail,
} from "lucide-react";

import { createClient } from "../../../utils/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleResetPassword(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMessage(
        "Please enter your email address."
      );
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const { error } =
  await supabase.auth.resetPasswordForEmail(
    trimmedEmail,
    {
      redirectTo:
  `${window.location.origin}/auth/update-password`,
    }
  );

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage(
      "Password reset instructions have been sent. Please check your email."
    );

    setIsSubmitting(false);
  }

  return (
    <div className="rounded-3xl border border-[#EADCC4] bg-white p-6 shadow-xl sm:p-8">
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#2F6B3C] hover:underline"
      >
        <ArrowLeft size={17} />
        Back to sign in
      </Link>

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C88A22]">
          Password help
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[#174D2A]">
          Reset your password
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Enter the email address linked to your
          Kitchen Brain account. We’ll send you a
          secure password-reset link.
        </p>
      </div>

      <form
        onSubmit={handleResetPassword}
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
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-xl border border-[#EADCC4] bg-white py-3 pl-11 pr-4 outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/10"
            />
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
            ? "Sending reset link..."
            : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Remembered your password?{" "}
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