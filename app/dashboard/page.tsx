"use client";

import { useEffect, useState } from "react";
import Protected from "@/components/Protected";
import DashboardShell from "@/components/layout/dashboard-shell";
import StatCard from "@/components/shared/stat-card";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

function DashboardContent() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/dashboard/stats")
      .then(setStats)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      });
  }, []);

  if (error) {
    return (
      <DashboardShell title="Dashboard">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </DashboardShell>
    );
  }

  if (!stats) {
    return (
      <DashboardShell title="Dashboard">
        <div className="p-2 text-slate-500">Loading dashboard...</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Dashboard">
      <div className="space-y-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Applications"
            value={stats.totalApplications}
            description="All submitted recruitment applications"
            icon={FileText}
          />
          <StatCard
            title="Approved"
            value={stats.approvedApplications}
            description="Applications approved by HR"
            icon={CheckCircle2}
          />
          <StatCard
            title="Rejected"
            value={stats.rejectedApplications}
            description="Applications rejected after review"
            icon={XCircle}
          />
          <StatCard
            title="Pending"
            value={stats.pendingApplications}
            description="Applications awaiting review"
            icon={Clock3}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.5rem] border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Recruitment Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Summary of current application activity.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-100 p-5">
                <p className="text-sm font-medium text-slate-500">Approval Rate</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.totalApplications > 0
                    ? `${Math.round(
                        (stats.approvedApplications / stats.totalApplications) * 100
                      )}%`
                    : "0%"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-100 p-5">
                <p className="text-sm font-medium text-slate-500">Rejection Rate</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.totalApplications > 0
                    ? `${Math.round(
                        (stats.rejectedApplications / stats.totalApplications) * 100
                      )}%`
                    : "0%"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Quick Summary
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Current system recruitment status.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-4">
                <span className="text-sm font-medium text-slate-600">Submitted</span>
                <span className="text-base font-bold text-slate-900">
                  {stats.totalApplications}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-green-50 px-4 py-4">
                <span className="text-sm font-medium text-green-700">Approved</span>
                <span className="text-base font-bold text-green-800">
                  {stats.approvedApplications}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-4">
                <span className="text-sm font-medium text-red-700">Rejected</span>
                <span className="text-base font-bold text-red-800">
                  {stats.rejectedApplications}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-4">
                <span className="text-sm font-medium text-amber-700">Pending</span>
                <span className="text-base font-bold text-amber-800">
                  {stats.pendingApplications}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default function DashboardPage() {
  return (
    <Protected>
      <DashboardContent />
    </Protected>
  );
}