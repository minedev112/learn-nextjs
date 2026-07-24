import { getToken } from "./auth";

export const API_URL = "https://demo-blog.minebox.space/api";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getToken();
   
  const headers = {
    "Content-Type": "application/json",
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
    ...options.headers,
  };

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
}