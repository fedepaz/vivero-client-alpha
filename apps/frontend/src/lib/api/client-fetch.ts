// src/lib/api/client-fetch.ts
"use client";

const backendUrl = process.env.BACKEND_URL;

if (!backendUrl) {
  console.warn("BACKEND_URL is not set");
}

export async function clientFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };

  const res = await fetch(`${backendUrl}/${endpoint}`, {
    ...options,
    headers,
  });

  // Handle non 2xx responses
  if (!res.ok) {
    if (res.status === 401) {
      // Auto-sign out 401
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userProfile");
      window.location.href = "/";
    }
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || res.statusText);
  }

  return res.json() as Promise<T>;
}
