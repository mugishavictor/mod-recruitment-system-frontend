"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type ApplicationDetails = {
  id: number;
  referenceCode: string;
  applicantName: string;
  nid: string;
  email: string;
  phone: string;
  address: string;
  grade: string;
  schoolOption: string;
  status: string;
  cvFilePath?: string | null;
};

type Props = {
  applicationId: number | null;
  open: boolean;
  onClose: () => void;
  onReviewed: () => void;
};

function StatusBadge({ status }: { status: string }) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

  switch (status) {
    case "APPROVED":
      return <span className={`${base} bg-green-100 text-green-700`}>{status}</span>;
    case "REJECTED":
      return <span className={`${base} bg-red-100 text-red-700`}>{status}</span>;
    case "PENDING":
      return <span className={`${base} bg-amber-100 text-amber-700`}>{status}</span>;
    default:
      return <span className={`${base} bg-slate-100 text-slate-700`}>{status}</span>;
  }
}

export default function ApplicationReviewModal({
  applicationId,
  open,
  onClose,
  onReviewed,
}: Props) {
  const [item, setItem] = useState<ApplicationDetails | null>(null);
  const [decision, setDecision] = useState("APPROVED");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !applicationId) return;

    setLoading(true);
    setError("");
    setReason("");
    setDecision("APPROVED");

    apiFetch<ApplicationDetails>(`/hr/applications/${applicationId}`)
      .then(setItem)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load application details");
      })
      .finally(() => setLoading(false));
  }, [applicationId, open]);

  async function submitReview() {
    if (!applicationId) return;

    if (!reason.trim()) {
      setError("Reason is required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await apiFetch(`/hr/applications/${applicationId}/review`, {
        method: "PATCH",
        body: JSON.stringify({ decision, reason }),
      });

      onReviewed();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[1.5rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Application Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Review applicant details and record a decision.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <div className="space-y-6 p-6">
          {loading ? (
            <div className="rounded-2xl border bg-slate-50 p-6 text-slate-500">
              Loading application details...
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          ) : null}

          {item && !loading ? (
            <>
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[1.5rem] border bg-slate-50 p-5">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Applicant Information
                  </h3>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Full Name
                      </p>
                      <p className="mt-1 text-sm text-slate-900">{item.applicantName}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        National ID
                      </p>
                      <p className="mt-1 text-sm text-slate-900">{item.nid}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Email
                      </p>
                      <p className="mt-1 text-sm text-slate-900">{item.email}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Phone
                      </p>
                      <p className="mt-1 text-sm text-slate-900">{item.phone}</p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Address
                      </p>
                      <p className="mt-1 text-sm text-slate-900">{item.address || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border bg-slate-50 p-5">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Application Summary
                  </h3>

                  <div className="mt-5 space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Reference Code
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {item.referenceCode}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Grade
                      </p>
                      <p className="mt-1 text-sm text-slate-900">{item.grade || "-"}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        School Option
                      </p>
                      <p className="mt-1 text-sm text-slate-900">
                        {item.schoolOption || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </p>
                      <div className="mt-2">
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {item.status === 'PENDING' && (
              <div className="rounded-[1.5rem] border bg-white p-5">
                <h3 className="text-lg font-semibold text-slate-900">Review Decision</h3>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Decision
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                      value={decision}
                      onChange={(e) => setDecision(e.target.value)}
                    >
                      <option value="APPROVED">Approve</option>
                      <option value="REJECTED">Reject</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Reason
                    </label>
                    <textarea
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                      rows={4}
                      placeholder="Enter review reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={submitReview}
                      disabled={submitting}
                      className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? "Submitting..." : "Submit Review"}
                    </button>

                    <button
                      onClick={onClose}
                      className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>)}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}