"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ProfileStatusPage() {
  const [referenceCode, setReferenceCode] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function lookup() {
    try {
      setError("");
      const data = await apiFetch(`/applications/status/${referenceCode}`);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-3xl font-semibold">Track Application</h1>

      <div className="flex gap-3">
        <input
          className="flex-1 rounded-md border p-3"
          value={referenceCode}
          onChange={(e) => setReferenceCode(e.target.value)}
          placeholder="Reference code"
        />
        <button onClick={lookup} className="rounded-md bg-black px-4 text-white">
          Check
        </button>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {result ? (
        <div className="rounded-xl border p-4 space-y-2">
          <p><strong>Applicant:</strong> {result.applicantName}</p>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Reason:</strong> {result.reviewReason || "No review yet"}</p>
        </div>
      ) : null}
    </div>
  );
}