export function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    return `http://${hostname}:5000/api`;
  }
  return "http://localhost:5000/api";
}

export const API_URL = "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("auth_token");
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    window.localStorage.setItem("auth_token", token);
  } else {
    window.localStorage.removeItem("auth_token");
  }
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    auth = true,
    headers,
    body,
    ...rest
  } = options;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    "Bypass-Tunnel-Reminder": "true",
    ...(headers as Record<string, string>),
  };


  // Only set JSON Content-Type when the body is NOT FormData.
  if (!(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();

    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const baseUrl = getApiUrl();

  const controller = typeof window === "undefined" ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), 3500) : null;

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...rest,
      headers: finalHeaders,
      body,
      signal: controller ? controller.signal : rest.signal,
    });

    if (timeoutId) clearTimeout(timeoutId);


    if (!response.ok) {
      let message = response.statusText;

      try {
        const responseBody = await response.json();

        message =
          responseBody?.message ||
          responseBody?.error?.message ||
          responseBody?.data?.message ||
          message;
      } catch {
        // Ignore non-JSON response
      }

      throw new ApiError(message, response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}


export const api = {
  get: async <T>(path: string): Promise<T> => {
    const res = await apiFetch<{ success: boolean; data: T }>(path, { method: "GET" });
    return res.data !== undefined ? res.data : (res as unknown as T);
  },
  post: async <T>(path: string, body: any): Promise<T> => {
    const res = await apiFetch<{ success: boolean; data: T }>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return res.data !== undefined ? res.data : (res as unknown as T);
  },
  put: async <T>(path: string, body: any): Promise<T> => {
    const res = await apiFetch<{ success: boolean; data: T }>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    return res.data !== undefined ? res.data : (res as unknown as T);
  },
  delete: async <T>(path: string): Promise<T> => {
    const res = await apiFetch<{ success: boolean; data: T }>(path, { method: "DELETE" });
    return res.data !== undefined ? res.data : (res as unknown as T);
  },
};


/**
 * Simulates network latency for mock-data services.
 */
export function mockDelay(ms = 500): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function getImageUrl(url: string): string {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const baseUrl = getApiUrl();
  const backendUrl = baseUrl.replace(/\/api\/?$/, "");

  if (url.startsWith("/uploads/")) {
    return `${backendUrl}${url}`;
  }

  return url;
}

