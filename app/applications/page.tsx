"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import Protected from "@/components/Protected";

export default function ApplicationsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    apiFetch<any[]>("/hr/applications").then(setItems).catch(console.error);
  }, []);

  return (
    <Protected>
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-semibold">Latest Applications</h1>

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="p-3">Reference</th>
              <th className="p-3">Applicant</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">{item.referenceCode}</td>
                <td className="p-3">{item.applicantName}</td>
                <td className="p-3">{item.status}</td>
                <td className="p-3">
                  <Link href={`/applications/${item.id}`} className="underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </Protected>
  );
}