"use client";

import { useState } from "react";
import PublicShell from "@/components/layout/public-shell";
import { apiFetch } from "@/lib/api";
import { FeedbackAlert } from "@/components/shared/feedback-alert";

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
    <PublicShell
      title="Track Application Status"
      description="Enter your application reference code to check the current review status of your submission."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border bg-white p-6 shadow-sm md:p-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Reference Code
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
                placeholder="Enter reference code"
              />
            </div>

            <button
              onClick={lookup}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Check Status
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {error ? (
            <FeedbackAlert type="error" title="Lookup failed" message={error} />
          ) : null}

          {result ? (
            <div className="rounded-[2rem] border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Application Status</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <p><span className="font-medium">Applicant:</span> {result.applicantName}</p>
                <p><span className="font-medium">Reference Code:</span> {result.referenceCode}</p>
                <p><span className="font-medium">Status:</span> {result.status}</p>
                <p><span className="font-medium">Reason:</span> {result.reviewReason || "No review yet"}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Status Lookup</h3>
              <p className="mt-3 text-sm text-slate-600">
                Use the reference code you received after submitting your application.
              </p>
            </div>
          )}
        </div>
      </div>
    </PublicShell>
  );
}