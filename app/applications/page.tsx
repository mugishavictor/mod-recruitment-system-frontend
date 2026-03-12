"use client";

import { useEffect, useMemo, useState } from "react";
import Protected from "@/components/Protected";
import DashboardShell from "@/components/layout/dashboard-shell";
import { apiFetch } from "@/lib/api";
import ApplicationReviewModal from "@/components/applications/application-review-modal";
import { Download } from "lucide-react";

type ApplicationItem = {
  id: number;
  referenceCode: string;
  applicantName: string;
  status: string;
  reviewReason?: string | null;
  cvFileName?: string | null;
  cvDownloadUrl?: string | null;
};

const PAGE_SIZE = 5;

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

function ApplicationsContent() {
  const [items, setItems] = useState<ApplicationItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"applicantName" | "referenceCode" | "status">(
    "applicantName"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function loadApplications() {
    setLoading(true);
    apiFetch<ApplicationItem[]>("/hr/applications")
      .then((data) => setItems(data))
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load applications");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredAndSorted = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = items.filter((item) => {
      return (
        item.applicantName.toLowerCase().includes(q) ||
        item.referenceCode.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      const aValue = String(a[sortBy]).toLowerCase();
      const bValue = String(b[sortBy]).toLowerCase();

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [items, search, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));
  const paginatedItems = filteredAndSorted.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, sortOrder]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function toggleSort(column: "applicantName" | "referenceCode" | "status") {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  }

  function sortIndicator(column: "applicantName" | "referenceCode" | "status") {
    if (sortBy !== column) return "↕";
    return sortOrder === "asc" ? "↑" : "↓";
  }

  function openModal(id: number) {
    setSelectedId(id);
    setModalOpen(true);
  }

  console.log("===> ",paginatedItems);

  return (
    <DashboardShell title="Applicants List">
      <div className="space-y-6">
        <div className="rounded-[1.5rem] border bg-white p-6 shadow-sm">
          {error ? (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Latest Applicants
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest 10 submitted applications sorted alphabetically.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search applicant, reference, or status"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 sm:w-80"
              />

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "applicantName" | "referenceCode" | "status"
                  )
                }
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
              >
                <option value="applicantName">Sort by Applicant</option>
                <option value="referenceCode">Sort by Reference</option>
                <option value="status">Sort by Status</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th
                    onClick={() => toggleSort("referenceCode")}
                    className="cursor-pointer px-4 py-3 font-semibold text-slate-600"
                  >
                    Reference {sortIndicator("referenceCode")}
                  </th>
                  <th
                    onClick={() => toggleSort("applicantName")}
                    className="cursor-pointer px-4 py-3 font-semibold text-slate-600"
                  >
                    Applicant {sortIndicator("applicantName")}
                  </th>
                  <th
                    onClick={() => toggleSort("status")}
                    className="cursor-pointer px-4 py-3 font-semibold text-slate-600"
                  >
                    Status {sortIndicator("status")}
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Reason</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">CV File</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      Loading applications...
                    </td>
                  </tr>
                ) : paginatedItems.length > 0 ? (
                  paginatedItems.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-slate-50">
                      <td className="px-4 py-4 text-slate-700">{item.referenceCode}</td>

                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-900">{item.applicantName}</div>
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        {item.reviewReason || "-"}
                      </td>

                      <td className="px-4 py-4">
                        {item.cvDownloadUrl ? (
                          <a
                            href={item.cvDownloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                            title={item.cvFileName || "Download CV"}
                          >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Download</span>
                          </a>
                        ) : (
                          <span className="text-sm text-slate-400">No file</span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <button
                          onClick={() => openModal(item.id)}
                          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-700">
                {paginatedItems.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700">
                {filteredAndSorted.length}
              </span>{" "}
              results
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-3 text-sm text-slate-600">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <ApplicationReviewModal
          applicationId={selectedId}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onReviewed={loadApplications}
        />
      </div>
    </DashboardShell>
  );
}

export default function ApplicationsPage() {
  return (
    <Protected>
      <ApplicationsContent />
    </Protected>
  );
}