 "use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    apiFetch("/dashboard/stats").then(setStats).catch(console.error);
  }, []);

  if (!stats) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border p-4">Total: {stats.totalApplications}</div>
        <div className="rounded-xl border p-4">Approved: {stats.approvedApplications}</div>
        <div className="rounded-xl border p-4">Rejected: {stats.rejectedApplications}</div>
        <div className="rounded-xl border p-4">Pending: {stats.pendingApplications}</div>
      </div>
    </div>
    
  );
}