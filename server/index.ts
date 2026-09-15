import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

import {
  STORAGE_PATH,
  buildRobotsTxt,
  buildSitemapXml,
  resolveSiteUrl,
} from "../shared/site";
import {
  extractStorageKey,
  readStorageCredentials,
  resolveStorageResponse,
} from "../shared/storage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ONE_DAY_SECONDS = 60 * 60 * 24;
const ONE_MONTH_SECONDS = ONE_DAY_SECONDS * 30;
const ONE_YEAR_SECONDS = ONE_DAY_SECONDS * 365;

/** Credenciais do storage remoto das imagens (mesmo contrato do proxy do Vite). */
const STORAGE_CREDENTIALS = readStorageCredentials(process.env);

/**
 * Entrega as imagens de `/manus-storage/<arquivo>` que **não** existem em
 * `client/public/manus-storage/` (as versionadas são servidas antes, pelo
 * `express.static` — caminho recomendado, sem dependência externa).
 *
 * A política de resposta (proxy assinado `307` → **404**, nunca o HTML do
 * fallback SPA) vive em `shared/storage.ts`, compartilhada com a Vercel Function
 * `api/manus-storage/[...key].ts`.
 */
async function handleStorageRequest(
  req: express.Request,
  res: express.Response
) {
  const result = await resolveStorageResponse(
    extractStorageKey(req.url || "", STORAGE_PATH),
    STORAGE_CREDENTIALS
  );

  if (result.status === 307) {
    // `no-store` evita que o browser cacheie o redirecionamento temporário.
    res.setHeader("Cache-Control", "no-store");
    res.redirect(307, result.location);
    return;
  }

  res.status(result.status).type("text/plain").send(result.message);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  const siteUrl = resolveSiteUrl(
    process.env.SITE_URL || process.env.VITE_SITE_URL
  );

  // SEO: robots.txt e sitemap.xml gerados a partir de `shared/site.ts`.
  // Registrados antes do static para que a env `SITE_URL` tenha precedência
  // sobre os arquivos de fallback de `client/public/`.
  app.get("/robots.txt", (_req, res) => {
    res
      .type("text/plain; charset=utf-8")
      .set("Cache-Control", `public, max-age=${ONE_DAY_SECONDS}`)
      .send(buildRobotsTxt(siteUrl));
  });

  app.get("/sitemap.xml", (_req, res) => {
    res
      .type("application/xml; charset=utf-8")
      .set("Cache-Control", `public, max-age=${ONE_DAY_SECONDS}`)
      .send(buildSitemapXml(siteUrl));
  });

  app.use(
    express.static(staticPath, {
      setHeaders: (res, filePath) => {
        // HTML sempre revalida: o build troca os nomes dos assets com hash.
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache");
          return;
        }
        // Assets do Vite (`/assets/index-<hash>.css|js`) são imutáveis.
        if (/[\\/]assets[\\/]/.test(filePath)) {
          res.setHeader(
            "Cache-Control",
            `public, max-age=${ONE_YEAR_SECONDS}, immutable`
          );
          return;
        }
        // Imagens versionadas (nome com hash de conteúdo).
        if (/[\\/]manus-storage[\\/]/.test(filePath)) {
          res.setHeader(
            "Cache-Control",
            `public, max-age=${ONE_MONTH_SECONDS}`
          );
          return;
        }
        res.setHeader("Cache-Control", `public, max-age=${ONE_DAY_SECONDS}`);
      },
    })
  );

  // Imagens ausentes localmente caem aqui — nunca no fallback SPA.
  app.use(STORAGE_PATH, handleStorageRequest);

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
