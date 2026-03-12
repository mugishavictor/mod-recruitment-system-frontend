"use client";

import { useState } from "react";
import PublicShell from "@/components/layout/public-shell";
import { apiFetch } from "@/lib/api";
import { FeedbackAlert } from "@/components/shared/feedback-alert";

export default function ApplyPage() {
  const [nid, setNid] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    address: "",
    grade: "",
    schoolOption: "",
  });
  const [cv, setCv] = useState<File | null>(null);
  const [referenceCode, setReferenceCode] = useState("");
  const [error, setError] = useState("");

  async function fetchSimulations() {
    try {
      setError("");
      const nidData = await apiFetch<any>(`/simulations/nid/${nid}`);
      const nesaData = await apiFetch<any>(`/simulations/nesa/${nid}`);

      setForm((prev) => ({
        ...prev,
        firstName: nidData.firstName,
        lastName: nidData.lastName,
        dateOfBirth: nidData.dateOfBirth,
        address: nidData.address,
        grade: nesaData.grade,
        schoolOption: nesaData.schoolOption,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch simulated data");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cv) {
      setError("Please attach your CV");
      return;
    }

    try {
      setError("");
      const formData = new FormData();

      formData.append(
        "data",
        new Blob([JSON.stringify({ nid, ...form })], { type: "application/json" })
      );

      formData.append("cv", cv);

      const response = await apiFetch<{ referenceCode: string }>("/applications", {
        method: "POST",
        body: formData,
      });

      setReferenceCode(response.referenceCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application");
    }
  }

  return (
    <PublicShell
      title="Apply"
      description="Complete your application details, upload your CV, and submit your profile for review."
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row">
            <input
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
              placeholder="Enter NID"
              value={nid}
              onChange={(e) => setNid(e.target.value)}
            />
            <button
              type="button"
              onClick={fetchSimulations}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Fetch NID/NESA
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Date of birth" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Grade" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
            <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="School option" value={form.schoolOption} onChange={(e) => setForm({ ...form, schoolOption: e.target.value })} />

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Upload CV
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCv(e.target.files?.[0] || null)}
              />
            </div>

            <button className="md:col-span-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Submit Application
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {error ? (
            <FeedbackAlert type="error" title="Submission failed" message={error} />
          ) : null}

          {referenceCode ? (
            <FeedbackAlert
              type="success"
              title="Application submitted"
              message={`Your reference code is ${referenceCode}`}
            />
          ) : null}

          <div className="rounded-[2rem] border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Before you submit</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Provide a valid NID to fetch profile and education details.</li>
              <li>Ensure your email and phone number are correct.</li>
              <li>Upload your CV in PDF, DOC, or DOCX format.</li>
              <li>Save your reference code to track your application status.</li>
            </ul>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}