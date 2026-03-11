"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Protected from "@/components/Protected";

export default function UsersPage() {
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
    <Protected>
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Users</h1>

      <form onSubmit={createUser} className="grid gap-4 md:grid-cols-4">
        <input className="rounded-md border p-3" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className="rounded-md border p-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="rounded-md border p-3" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="rounded-md border p-3" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="HR">HR</option>
          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          <option value="APPLICANT">APPLICANT</option>
        </select>
        <button className="rounded-md bg-black px-4 py-3 text-white md:col-span-4">Create User</button>
      </form>

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="p-3">Full Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Active</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-3">{user.fullName}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{String(user.isActive)}</td>
                <td className="p-3">
                  <button onClick={() => toggleStatus(user.id)} className="underline">
                    Toggle Status
                  </button>
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