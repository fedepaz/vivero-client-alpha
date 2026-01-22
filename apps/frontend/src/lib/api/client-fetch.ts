// src/lib/api/client-fetch.ts
"use client";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendUrl) {
  console.warn("NEXT_PUBLIC_BACKEND_URL is not set");
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new ApiError("No refresh token found", 401);
  }

  const response = await fetch(`${backendUrl}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || response.statusText,
      response.status,
    );
  }
  const data = await response.json();
  localStorage.setItem("accessToken", data.accessToken);
  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }
  return data.accessToken;
}

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userProfile");
  window.location.href = "/";
}

export async function clientFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

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
        // Try to refresh the token
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise<T>((resolve, reject) => {
            failedQueue.push({
              resolve: (newToken: string) => {
                // Retry the original request with new token
                clientFetch<T>(endpoint, {
                  ...options,
                  headers: {
                    ...options.headers,
                    Authorization: `Bearer ${newToken}`,
                  },
                })
                  .then(resolve)
                  .catch(reject);
              },
              reject: (error: Error) => {
                reject(error);
              },
            });
          });
        }

        // Start refresh process
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          processQueue(null, newToken);

          // Retry the original request with new token
          return clientFetch<T>(endpoint, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
        } catch (refreshError) {
          processQueue(new Error("Token refresh failed"), null);
          console.warn(refreshError, "Token refresh failed");
          logout();

          throw new ApiError("Session expired. Please log in again.", 401);
        } finally {
          isRefreshing = false;
        }
      }

      const errorData = await res.json().catch(() => ({}));
      throw new ApiError(errorData.message || res.statusText, res.status);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    // Si es un error de red (DNS, timeout, etc.)
    if (error instanceof TypeError) {
      throw new ApiError("Network error: unable to reach server", 0);
    }
    // Re-lanzar otros errores (como ApiError)
    throw error;
  }
}
