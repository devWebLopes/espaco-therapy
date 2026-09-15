import type { IncomingMessage, ServerResponse } from "node:http";

import { STORAGE_PATH } from "../../shared/site";
import {
  extractStorageKey,
  readStorageCredentials,
  resolveStorageResponse,
} from "../../shared/storage";

/**
 * Vercel Function que responde `/manus-storage/<arquivo>` na hospedagem estática.
 *
 * Em hospedagem estática não existe o servidor Express, então as imagens que não
 * estão versionadas em `client/public/manus-storage/` cairiam no fallback do SPA
 * (HTML no lugar da imagem — bug P0-1, ver `docs/seo-and-assets.md`). Esta função
 * reproduz exatamente a política de `shared/storage.ts`: arquivo local → proxy
 * assinado (`307`) → **404 `text/plain`**.
 *
 * Roteamento: `vercel.json` reescreve `/manus-storage/<arquivo>` para
 * `/api/manus-storage/<arquivo>`. Como as reescritas são aplicadas **depois** dos
 * arquivos estáticos, uma imagem versionada no repositório tem precedência.
 *
 * Requisito para o proxy: definir `BUILT_IN_FORGE_API_URL` e
 * `BUILT_IN_FORGE_API_KEY` nas Environment Variables do projeto na Vercel.
 * O caminho recomendado continua sendo versionar as imagens (ver
 * `docs/seo-and-assets.md` §2).
 */
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const result = await resolveStorageResponse(
    extractStorageKey(req.url ?? "", STORAGE_PATH),
    readStorageCredentials(process.env)
  );

  if (result.status === 307) {
    res.statusCode = 307;
    // `no-store` evita que o browser cacheie o redirecionamento temporário.
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Location", result.location);
    res.end();
    return;
  }

  res.statusCode = result.status;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(result.message);
}
