/**
 * HTTP-клиент. Когда подключите бэк — пропишите VITE_API_URL в .env
 * и установите VITE_USE_MOCKS=false. До этого все запросы идут в mock-слой.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";
export const USE_MOCKS =
  (import.meta.env.VITE_USE_MOCKS ?? "true") !== "false";

const TOKEN_KEY = "ej_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function request<T>(
  path: string,
  options: { method?: Method; body?: unknown; query?: Record<string, string | number | undefined> } = {}
): Promise<T> {
  const { method = "GET", body, query } = options;

  const url = new URL(BASE_URL + path, window.location.origin);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      message = data.message ?? message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
