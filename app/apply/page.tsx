"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PublicShell from "@/components/layout/public-shell";
import { apiFetch } from "@/lib/api";
import { FeedbackAlert } from "@/components/shared/feedback-alert";
import { useDebounce } from "@/hooks/use-debounce";

type NidResponse = {
  nid: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  district: string;
  province: string;
};

type NesaResponse = {
  candidateNumber: string;
  schoolName: string;
  academicYear: string;
  grade: string;
  combination: string;
  optionAttended: string;
};

export default function ApplyPage() {
  const [nid, setNid] = useState("");
  const [candidateNumber, setCandidateNumber] = useState("");

  const debouncedNid = useDebounce(nid, 700);
  const debouncedCandidateNumber = useDebounce(candidateNumber, 700);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    district: "",
    province: "",
    schoolName: "",
    academicYear: "",
    grade: "",
    combination: "",
    optionAttended: "",
    email: "",
    phone: "",
  });

  const [cv, setCv] = useState<File | null>(null);
  const [referenceCode, setReferenceCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [nidLoading, setNidLoading] = useState(false);
  const [nesaLoading, setNesaLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const feedbackRef = useRef<HTMLDivElement | null>(null);
  const referenceRef = useRef<HTMLDivElement | null>(null);

  const nidValid = useMemo(() => /^\d{16}$/.test(debouncedNid), [debouncedNid]);
  const candidateValid = useMemo(
    () => debouncedCandidateNumber.trim().length >= 3,
    [debouncedCandidateNumber]
  );

  useEffect(() => {
    async function fetchNidDetails() {
      if (!nidValid) return;

      try {
        setError("");
        setNidLoading(true);

        const nidData = await apiFetch<NidResponse>(`/simulations/nid/${debouncedNid}`);

        setForm((prev) => ({
          ...prev,
          firstName: nidData.firstName || "",
          lastName: nidData.lastName || "",
          dateOfBirth: nidData.dateOfBirth || "",
          gender: nidData.gender || "",
          address: nidData.address || "",
          district: nidData.district || "",
          province: nidData.province || "",
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch NID details");
      } finally {
        setNidLoading(false);
      }
    }

    fetchNidDetails();
  }, [debouncedNid, nidValid]);

  useEffect(() => {
    async function fetchNesaDetails() {
      if (!candidateValid) return;

      try {
        setError("");
        setNesaLoading(true);

        const nesaData = await apiFetch<NesaResponse>(
          `/simulations/nesa/candidate/${debouncedCandidateNumber}`
        );

        setForm((prev) => ({
          ...prev,
          schoolName: nesaData.schoolName || "",
          academicYear: nesaData.academicYear || "",
          grade: nesaData.grade || "",
          combination: nesaData.combination || "",
          optionAttended: nesaData.optionAttended || "",
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch NESA details");
      } finally {
        setNesaLoading(false);
      }
    }

    fetchNesaDetails();
  }, [debouncedCandidateNumber, candidateValid]);

  useEffect(() => {
    if (referenceCode && referenceRef.current) {
      referenceRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (error && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [referenceCode, error]);

  function updateField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function copyReferenceCode() {
    if (!referenceCode) return;
    await navigator.clipboard.writeText(referenceCode);
    setSuccess("Reference code copied successfully.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setReferenceCode("");

    if (!/^\d{16}$/.test(nid)) {
      setError("NID must be exactly 16 digits");
      return;
    }

    if (!candidateNumber.trim()) {
      setError("Candidate number is required");
      return;
    }

    if (!form.firstName || !form.lastName) {
      setError("Please provide a valid NID and wait for identity details to load");
      return;
    }

    if (!form.schoolName || !form.grade) {
      setError("Please provide a valid NESA candidate number and wait for education details to load");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!form.phone.trim()) {
      setError("Phone number is required");
      return;
    }

    if (!cv) {
      setError("Please attach your CV");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append(
        "data",
        new Blob(
          [
            JSON.stringify({
              nid,
              candidateNumber,
              firstName: form.firstName,
              lastName: form.lastName,
              dateOfBirth: form.dateOfBirth,
              gender: form.gender,
              address: form.address,
              district: form.district,
              province: form.province,
              schoolName: form.schoolName,
              academicYear: form.academicYear,
              grade: form.grade,
              combination: form.combination,
              schoolOption: form.optionAttended,
              email: form.email,
              phone: form.phone,
            }),
          ],
          { type: "application/json" }
        )
      );

      formData.append("cv", cv);

      const response = await apiFetch<{ referenceCode: string }>("/applications", {
        method: "POST",
        body: formData,
      });

      setReferenceCode(response.referenceCode);
      setSuccess("Application submitted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PublicShell
      title="Apply"
      description="Provide your NID and NESA candidate number to auto-fill your profile, then complete the remaining details and submit your application."
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border bg-white p-6 shadow-sm md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  National ID Number
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                  placeholder="Enter 16-digit NID"
                  value={nid}
                  onChange={(e) => setNid(e.target.value.replace(/\D/g, "").slice(0, 16))}
                />
                <p className="text-xs text-slate-500">
                  NID details will auto-load after typing 16 digits.
                </p>
                {nidLoading ? (
                  <p className="text-xs font-medium text-slate-500">Fetching NID details...</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  NESA Candidate Number
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                  placeholder="Enter candidate number"
                  value={candidateNumber}
                  onChange={(e) => setCandidateNumber(e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  Education details will auto-load after entering a valid candidate number.
                </p>
                {nesaLoading ? (
                  <p className="text-xs font-medium text-slate-500">Fetching NESA details...</p>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Fetched Profile Details
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <input className="rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder="First name" value={form.firstName} readOnly />
                <input className="rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder="Last name" value={form.lastName} readOnly />
                <input className="rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder="Date of birth" value={form.dateOfBirth} readOnly />
                <input className="rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder="Gender" value={form.gender} readOnly />
                <input className="rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder="District" value={form.district} readOnly />
                <input className="rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder="Province" value={form.province} readOnly />
                <input className="md:col-span-2 rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder="Address" value={form.address} readOnly />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Fetched Education Details
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <input className="md:col-span-2 rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder="School name" value={form.schoolName} readOnly />
                <input className="rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder="Academic year" value={form.academicYear} readOnly />
                <input className="rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder="Grade" value={form.grade} readOnly />
                <input className="rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder="Combination" value={form.combination} readOnly />
                <input className="rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder="Option attended" value={form.optionAttended} readOnly />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Telephone</label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Upload CV</label>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCv(e.target.files?.[0] || null)}
              />
            </div>

            {error ? (
              <div ref={feedbackRef}>
                <FeedbackAlert
                  type="error"
                  title="Submission failed"
                  message={error}
                />
              </div>
            ) : null}

            <button
              disabled={submitting}
              className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {success && !referenceCode ? (
            <FeedbackAlert type="success" title="Success" message={success} />
          ) : null}

          {referenceCode ? (
            <div
              ref={referenceRef}
              className="overflow-hidden rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-sm"
            >
              <div className="border-b border-emerald-100 bg-emerald-100/60 px-6 py-4">
                <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
                  Application Submitted
                </p>
                <h3 className="mt-1 text-xl font-bold text-emerald-900">
                  Your reference code is ready
                </h3>
              </div>

              <div className="space-y-5 px-6 py-6">
                <div className="rounded-2xl border border-emerald-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Reference Code
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="break-all text-2xl font-extrabold tracking-[0.2em] text-emerald-700">
                      {referenceCode}
                    </span>
                    <button
                      type="button"
                      onClick={copyReferenceCode}
                      className="shrink-0 rounded-xl border border-emerald-200 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/80 p-4 text-sm text-slate-700">
                  <p className="font-medium text-slate-900">Important</p>
                  <p className="mt-2">
                    Save this code carefully. You will use it on the status tracking page
                    to monitor your application progress.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="/profile-status"
                    className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Track Application
                  </a>
                  <button
                    type="button"
                    onClick={copyReferenceCode}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Copy Code Again
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-[2rem] border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Application Steps</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Enter a valid 16-digit NID to fetch identity details.</li>
              <li>Enter your NESA candidate number to fetch education details.</li>
              <li>Add your email address and telephone number.</li>
              <li>Upload your CV in PDF, DOC, or DOCX format.</li>
              <li>Submit and save your reference code.</li>
            </ul>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}