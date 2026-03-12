"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PublicShell from "@/components/layout/public-shell";
import { apiFetch } from "@/lib/api";
import { FeedbackAlert } from "@/components/shared/feedback-alert";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await apiFetch<{
        token: string;
        role: string;
        fullName: string;
        email: string;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("fullName", data.fullName);

      setSuccess("Login successful. Redirecting to dashboard...");
      router.push("/dashboard");
    } catch (err: any ) {
      
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <PublicShell
      title="Login"
      description="Sign in to access the recruitment dashboard, review applications, and manage users."
    >
      <div className="max-w-2xl">
        <div className="rounded-[2rem] border bg-white p-6 shadow-sm md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error ? (
              <FeedbackAlert
                type="error"
                title="Login failed"
                message={error}
              />
            ) : null}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </PublicShell>
  );
}