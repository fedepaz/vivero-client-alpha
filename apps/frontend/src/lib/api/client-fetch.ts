// src/lib/api/client-fetch.ts
"use client";

const backendUrl = process.env.BACKEND_URL;

if (!backendUrl) {
  console.warn("BACKEND_URL is not set");
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

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token found");
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
    throw new Error("Failed to refresh auth token");
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
        logout();

        throw new Error("Session expired. Please log in again.", {
          cause: refreshError,
        });
      } finally {
        isRefreshing = false;
      }
    }

    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || res.statusText);
  }

  return res.json() as Promise<T>;
}

// Optional: Helper for login to store tokens
export async function login(email: string, password: string) {
  const response = await fetch(`${backendUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Login failed");
  }

  const data = await response.json();

  // Store tokens
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  // Optionally store user profile if returned
  if (data.user) {
    localStorage.setItem("userProfile", JSON.stringify(data.user));
  }

  return data;
}

// Optional: Helper for logout
export async function logoutUser() {
  try {
    const token = localStorage.getItem("accessToken");
    if (token) {
      await fetch(`${backendUrl}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    logout();
  }
}
