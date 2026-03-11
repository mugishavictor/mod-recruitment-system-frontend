"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

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
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Apply</h1>

      <div className="flex gap-3">
        <input
          className="flex-1 rounded-md border p-3"
          placeholder="Enter NID"
          value={nid}
          onChange={(e) => setNid(e.target.value)}
        />
        <button
          type="button"
          onClick={fetchSimulations}
          className="rounded-md bg-black px-4 text-white"
        >
          Fetch NID/NESA
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input className="rounded-md border p-3" placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        <input className="rounded-md border p-3" placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        <input className="rounded-md border p-3" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="rounded-md border p-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="rounded-md border p-3" placeholder="Date of birth" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
        <input className="rounded-md border p-3" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input className="rounded-md border p-3" placeholder="Grade" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
        <input className="rounded-md border p-3" placeholder="School option" value={form.schoolOption} onChange={(e) => setForm({ ...form, schoolOption: e.target.value })} />

        <div className="md:col-span-2">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setCv(e.target.files?.[0] || null)}
          />
        </div>

        {error ? <p className="text-sm text-red-500 md:col-span-2">{error}</p> : null}

        <button className="rounded-md bg-black p-3 text-white md:col-span-2">
          Submit application
        </button>
      </form>

      {referenceCode ? (
        <div className="rounded-xl border p-4">
          <p className="font-medium">Application submitted successfully.</p>
          <p>Reference code: {referenceCode}</p>
        </div>
      ) : null}
    </div>
  );
}