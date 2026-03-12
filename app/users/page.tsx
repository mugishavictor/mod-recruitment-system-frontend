"use client";

import { useEffect, useState } from "react";
import Protected from "@/components/Protected";
import DashboardShell from "@/components/layout/dashboard-shell";
import { apiFetch } from "@/lib/api";

function UsersContent() {
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "HR",
  });

  async function loadUsers() {
    const data = await apiFetch<any[]>("/users");
    setUsers(data);
  }

  useEffect(() => {
    loadUsers().catch(console.error);
  }, []);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();

    await apiFetch("/users", {
      method: "POST",
      body: JSON.stringify(form),
    });

    setForm({ fullName: "", email: "", password: "", role: "HR" });
    loadUsers();
  }

  async function toggleStatus(id: number) {
    await apiFetch(`/users/${id}/status`, {
      method: "PATCH",
    });
    loadUsers();
  }

  return (
    <DashboardShell title="User Management">
      <div className="space-y-6">
        <div className="rounded-[1.5rem] border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Create User</h2>
          <p className="mt-1 text-sm text-slate-500">
            Add HR or Super Admin users to the system.
          </p>

          <form onSubmit={createUser} className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <input
              className="rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Full name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              className="rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="rounded-xl border border-slate-300 px-4 py-3"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <select
              className="rounded-xl border border-slate-300 px-4 py-3"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="HR">HR</option>
              <option value="SUPER_ADMIN">SUPER ADMIN</option>
            </select>

            <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 md:col-span-2 xl:col-span-4">
              Create User
            </button>
          </form>
        </div>

        <div className="rounded-[1.5rem] border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">System Users</h2>
          <p className="mt-1 text-sm text-slate-500">
            View and manage registered users.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-600">Full Name</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Email</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Role</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Active</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-4 font-medium text-slate-900">{user.fullName}</td>
                    <td className="px-4 py-4 text-slate-700">{user.email}</td>
                    <td className="px-4 py-4 text-slate-700">{user.role}</td>
                    <td className="px-4 py-4 text-slate-700">
                      {user.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}

                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default function UsersPage() {
  return (
    <Protected>
      <UsersContent />
    </Protected>
  );
}