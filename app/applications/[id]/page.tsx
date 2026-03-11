"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import Protected from "@/components/Protected";

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [item, setItem] = useState<any>(null);
  const [decision, setDecision] = useState("APPROVED");
  const [reason, setReason] = useState("");

  useEffect(() => {
    apiFetch(`/hr/applications/${params.id}`).then(setItem).catch(console.error);
  }, [params.id]);

  async function submitReview() {
    await apiFetch(`/hr/applications/${params.id}/review`, {
      method: "PATCH",
      body: JSON.stringify({ decision, reason }),
    });

    router.push("/applications");
  }

  if (!item) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <Protected>
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Application Details</h1>

      <div className="rounded-xl border p-4 space-y-2">
        <p><strong>Name:</strong> {item.applicantName}</p>
        <p><strong>NID:</strong> {item.nid}</p>
        <p><strong>Email:</strong> {item.email}</p>
        <p><strong>Phone:</strong> {item.phone}</p>
        <p><strong>Address:</strong> {item.address}</p>
        <p><strong>Grade:</strong> {item.grade}</p>
        <p><strong>School Option:</strong> {item.schoolOption}</p>
        <p><strong>Status:</strong> {item.status}</p>
      </div>

      <div className="rounded-xl border p-4 space-y-4">
        <h2 className="text-xl font-medium">Review</h2>

        <select
          className="w-full rounded-md border p-3"
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
        >
          <option value="APPROVED">Approve</option>
          <option value="REJECTED">Reject</option>
        </select>

        <textarea
          className="w-full rounded-md border p-3"
          rows={4}
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button
          onClick={submitReview}
          className="rounded-md bg-black px-4 py-3 text-white"
        >
          Submit Review
        </button>
      </div>
    </div>
    </Protected>
  );
}