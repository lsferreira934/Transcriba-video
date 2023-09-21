export async function fetchWrapperServer<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
  multipart = false
): Promise<{ status: number; data: T }> {
  const defaultHeaders = new Headers(init?.headers);

  if (!multipart) defaultHeaders.set("Content-Type", "application/json");

  const apiUrl = `${import.meta.env.VITE_APP_API_SERVER}/${input}`;

  try {
    const response = await fetch(apiUrl, {
      ...init,
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(
        `Erro na requisição: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error: any) {
    throw new Error(`Erro na requisição: ${error.message}`);
  }
}
