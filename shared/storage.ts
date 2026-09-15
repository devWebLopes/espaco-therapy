/**
 * Entrega das imagens de `/manus-storage/<arquivo>`.
 *
 * Módulo compartilhado entre as duas hospedagens do projeto, para que a política
 * de resposta seja idêntica em ambas:
 * - `server/index.ts` (hospedagem Node/Express, ex.: `pnpm start`);
 * - `api/manus-storage/[...key].ts` (Vercel Function usada na hospedagem estática).
 *
 * Regras (ver `docs/seo-and-assets.md`):
 * 1. **Arquivo versionado:** `client/public/manus-storage/<arquivo>` é servido
 *    antes, pelas camadas de arquivo estático (`express.static` no Express e a
 *    CDN da Vercel). Este módulo não é acionado nesse caso.
 * 2. **Proxy assinado:** sem arquivo local e com as credenciais
 *    (`BUILT_IN_FORGE_API_URL` + `BUILT_IN_FORGE_API_KEY`) definidas, devolvemos a
 *    URL assinada para um redirecionamento `307`.
 * 3. **Ausente:** respondemos **404 `text/plain`** — nunca o HTML do fallback SPA
 *    (era o bug P0-1, em que toda imagem quebrada retornava a página inteira).
 */

/** Credenciais do storage remoto das imagens (envs `BUILT_IN_FORGE_*`). */
export interface StorageCredentials {
  baseUrl: string;
  apiKey?: string;
}

/** Resultado da resolução de uma imagem: redirecionamento assinado ou erro. */
export type StorageResolution =
  | { status: 307; location: string }
  | { status: 400 | 404 | 502; message: string };

/** Lê as credenciais do storage de um mapa de envs (normalmente `process.env`). */
export function readStorageCredentials(
  env: Record<string, string | undefined>
): StorageCredentials {
  return {
    baseUrl: (env.BUILT_IN_FORGE_API_URL ?? "").replace(/\/+$/, ""),
    apiKey: env.BUILT_IN_FORGE_API_KEY,
  };
}

/** A chave é aceita apenas se for relativa, não vazia e sem path traversal. */
export function isSafeStorageKey(key: string): boolean {
  return key.length > 0 && !key.includes("..") && !key.startsWith("/");
}

/**
 * Extrai a chave da imagem a partir da URL da requisição.
 *
 * Aceita tanto `req.url` relativo à montagem do Express (`/massagem.jpg`) quanto a
 * URL reescrita da Vercel (`/api/manus-storage/massagem.jpg`).
 */
export function extractStorageKey(
  requestUrl: string,
  storagePath: string
): string {
  const [path] = requestUrl.split("?");
  const marker = storagePath.endsWith("/") ? storagePath : `${storagePath}/`;
  const index = path.indexOf(marker);

  return index >= 0
    ? path.slice(index + marker.length)
    : path.replace(/^\/+/, "");
}

/**
 * Resolve uma requisição de imagem que **não** foi atendida por um arquivo local.
 *
 * `fetchImpl` é injetável para os testes (`shared/storage.test.ts`).
 */
export async function resolveStorageResponse(
  rawKey: string,
  credentials: StorageCredentials,
  fetchImpl: typeof fetch = fetch
): Promise<StorageResolution> {
  try {
    const key = decodeURIComponent(rawKey.replace(/^\/+/, ""));

    if (!isSafeStorageKey(key)) {
      return { status: 400, message: "Chave de imagem inválida" };
    }

    if (!credentials.baseUrl || !credentials.apiKey) {
      return { status: 404, message: "Imagem não encontrada" };
    }

    const forgeUrl = new URL(
      "v1/storage/presign/get",
      `${credentials.baseUrl}/`
    );
    forgeUrl.searchParams.set("path", key);

    const forgeResponse = await fetchImpl(forgeUrl, {
      headers: { Authorization: `Bearer ${credentials.apiKey}` },
    });

    if (!forgeResponse.ok) {
      return { status: 502, message: "Storage indisponível" };
    }

    const { url } = (await forgeResponse.json()) as { url?: string };
    if (!url) {
      return { status: 502, message: "URL assinada vazia" };
    }

    return { status: 307, location: url };
  } catch {
    return { status: 404, message: "Imagem não encontrada" };
  }
}
