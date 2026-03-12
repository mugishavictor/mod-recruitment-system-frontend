import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  FileText,
  ShieldCheck,
  Users,
} from "lucide-react";
import PublicHeader from "@/components/layout/public-header";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <PublicHeader />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            Recruitment made simple and transparent
          </div>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-6xl">
              Apply, track, and manage recruitment in one modern platform.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              The MOD Recruitment System helps applicants submit applications with ease,
              track progress using a reference code, and enables HR teams to review
              candidates efficiently through a secure dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Start Application
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Staff Login
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-slate-200 blur-3xl opacity-40" />
          <div className="rounded-[2rem] border bg-white p-6 shadow-xl">
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-900 p-5 text-white">
                <p className="text-sm text-slate-300">Applicant Flow</p>
                <h3 className="mt-2 text-2xl font-semibold">
                  Submit application in a few steps
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Fill in profile details, upload your CV, and receive a reference
                  code for tracking your application.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <FileText className="h-5 w-5 text-slate-700" />
                  </div>
                  <h4 className="font-semibold">Application Submission</h4>
                  <p className="mt-2 text-sm text-slate-500">
                    Applicants can submit their profile and CV through a streamlined form.
                  </p>
                </div>

                <div className="rounded-2xl border p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <ShieldCheck className="h-5 w-5 text-slate-700" />
                  </div>
                  <h4 className="font-semibold">Status Tracking</h4>
                  <p className="mt-2 text-sm text-slate-500">
                    Each submission returns a unique reference code for checking progress.
                  </p>
                </div>

                <div className="rounded-2xl border p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Users className="h-5 w-5 text-slate-700" />
                  </div>
                  <h4 className="font-semibold">HR Review</h4>
                  <p className="mt-2 text-sm text-slate-500">
                    HR teams can review applications, approve, or reject with reasons.
                  </p>
                </div>

                <div className="rounded-2xl border p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Briefcase className="h-5 w-5 text-slate-700" />
                  </div>
                  <h4 className="font-semibold">Admin Management</h4>
                  <p className="mt-2 text-sm text-slate-500">
                    Super Admin users can manage staff accounts and system access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}