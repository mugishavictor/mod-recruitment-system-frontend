"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl border p-6 shadow-sm"
      >
        <h1 className="text-2xl font-semibold">Login</h1>

        {success ? (
          <FeedbackAlert
            type="success"
            title="Success"
            message={success}
          />
        ) : null}

        {error ? (
          <FeedbackAlert
            type="error"
            title="Login failed"
            message={error}
          />
        ) : null}

        <input
          className="w-full rounded-md border p-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full rounded-md border p-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full rounded-md bg-black p-3 text-white">
          Sign in
        </button>
      </form>
    </div>
  );
}