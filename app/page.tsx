import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Recruitment System</h1>
        <div className="flex justify-center gap-4">
          <Link href="/login" className="rounded-md bg-black px-4 py-2 text-white">
            Login
          </Link>
          <Link href="/apply" className="rounded-md border px-4 py-2">
            Apply
          </Link>
          <Link href="/profile-status" className="rounded-md border px-4 py-2">
            Track Status
          </Link>
        </div>
      </div>
    </div>
  );
}