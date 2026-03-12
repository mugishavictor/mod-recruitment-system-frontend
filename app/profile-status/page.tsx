"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import PublicShell from "@/components/layout/public-shell";
import { apiFetch } from "@/lib/api";
import { FeedbackAlert } from "@/components/shared/feedback-alert";

type StatusResponse = {
  applicantName: string;
  referenceCode: string;
  status: string;
  reviewReason?: string | null;
};

export default function ProfileStatusPage() {
  const [referenceCode, setReferenceCode] = useState("");
  const [result, setResult] = useState<StatusResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  const feedbackRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  async function lookup() {
    if (!referenceCode.trim()) {
      setError("Please enter your reference code");
      setResult(null);
      return;
    }

    try {
      setError("");
      setResult(null);
      setLoading(true);

      const data = await apiFetch<StatusResponse>(
        `/applications/status/${referenceCode}`
      );

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (error && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [result, error]);

  async function copyReferenceCode() {
    if (!result?.referenceCode) return;
    await navigator.clipboard.writeText(result.referenceCode);
    setCopyMessage("Reference code copied");
    setTimeout(() => setCopyMessage(""), 2000);
  }

  function statusBadge(status: string) {
    const base =
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

    switch (status) {
      case "APPROVED":
        return `${base} bg-green-100 text-green-700`;
      case "REJECTED":
        return `${base} bg-red-100 text-red-700`;
      case "PENDING":
        return `${base} bg-blue-100 text-blue-700`;
      default:
        return `${base} bg-yellow-100 text-yellow-700`;
    }
  }

  return (
    <PublicShell
      title="Track Application Status"
      description="Enter your application reference code to check the current review status of your submission."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">

        {/* LEFT PANEL */}

        <div className="rounded-[2rem] border bg-white p-6 shadow-sm md:p-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Reference Code
              </label>

              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
                placeholder="Enter reference code (e.g. APP-123456)"
              />

              <p className="text-xs text-slate-500">
                This code was provided after submitting your application.
              </p>
            </div>

            <button
              onClick={lookup}
              disabled={loading}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? "Checking..." : "Check Status"}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div
          ref={feedbackRef}
          className="space-y-4 lg:sticky lg:top-24 lg:self-start"
        >
          {error ? (
            <FeedbackAlert type="error" title="Lookup failed" message={error} />
          ) : null}

          {result ? (
            <div
              ref={resultRef}
              className="overflow-hidden rounded-[2rem] border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-sm"
            >
              <div className="border-b border-blue-100 bg-blue-100/60 px-6 py-4">
                <p className="text-sm font-medium uppercase tracking-wide text-blue-700">
                  Application Status
                </p>
                <h3 className="mt-1 text-xl font-bold text-blue-900">
                  {result.applicantName}
                </h3>
              </div>

              <div className="space-y-5 px-6 py-6">

                <div className="rounded-2xl border bg-white p-4 space-y-2">
                  <p className="text-xs uppercase text-slate-500 font-semibold">
                    Reference Code
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold tracking-wider text-slate-800">
                      {result.referenceCode}
                    </span>

                    <button
                      onClick={copyReferenceCode}
                      className="rounded-lg border px-3 py-1 text-xs font-semibold hover:bg-slate-100"
                    >
                      Copy
                    </button>
                  </div>

                  {copyMessage && (
                    <p className="text-xs text-green-600">{copyMessage}</p>
                  )}
                </div>

                <div className="rounded-2xl border bg-white p-4 space-y-3">
                  <p className="text-xs uppercase text-slate-500 font-semibold">
                    Current Status
                  </p>

                  <span className={statusBadge(result.status)}>
                    {result.status}
                  </span>

                  <p className="text-sm text-slate-600">
                    {result.reviewReason || "No review yet"}
                  </p>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Link
                    href="/apply"
                    className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Submit Another Application
                  </Link>

                  <button
                    onClick={copyReferenceCode}
                    className="rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-slate-100"
                  >
                    Copy Reference
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">How to check status</h3>

              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>Enter your application reference code.</li>
                <li>Click "Check Status".</li>
                <li>View the current review result.</li>
                <li>If approved or rejected, the reason will be shown.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </PublicShell>
  );
}