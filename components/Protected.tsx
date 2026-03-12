"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ProtectedProps = {
  children: React.ReactNode;
};

export default function Protected({ children }: ProtectedProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      setAuthorized(false);
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (authorized === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-slate-500">Checking authentication...</p>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}