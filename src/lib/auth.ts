import { cookies } from "next/headers";

export async function getAuthHeaders(providedToken?: string | null): Promise<HeadersInit> {
  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (providedToken) {
    headers["Authorization"] = `Bearer ${providedToken}`;
    return headers;
  }

  // ✅ await obligatorio para Server Actions
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (tokenCookie) {
    headers["Cookie"] = `token=${tokenCookie.value}`;
  }

  return headers;
}

