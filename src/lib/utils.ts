import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple fetch wrapper that auto-refreshes access token on 401 once
export async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init);
  if (response.status !== 401) return response;

  // try refresh
  const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
  if (!refreshRes.ok) return response;
  // retry original request
  return fetch(input, init);
}