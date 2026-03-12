const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response : any = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const resp = await response.json()
    
    throw new Error(resp?.message || "Request failed");
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}