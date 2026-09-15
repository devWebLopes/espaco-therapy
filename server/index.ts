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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ONE_DAY_SECONDS = 60 * 60 * 24;
const ONE_MONTH_SECONDS = ONE_DAY_SECONDS * 30;
const ONE_YEAR_SECONDS = ONE_DAY_SECONDS * 365;

/** Storage remoto das imagens (mesmo contrato do proxy de dev do Vite). */
const FORGE_BASE_URL = (process.env.BUILT_IN_FORGE_API_URL || "").replace(
  /\/+$/,
  ""
);
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

/**
 * Entrega as imagens de `/manus-storage/<arquivo>`.
 *
 * 1. Arquivos versionados em `client/public/manus-storage/` são servidos antes
 *    por `express.static` (caminho recomendado, sem dependência externa).
 * 2. Quando o arquivo não existe localmente, geramos uma URL assinada no
 *    storage remoto (env `BUILT_IN_FORGE_API_URL`/`BUILT_IN_FORGE_API_KEY`) e
 *    redirecionamos com `307`.
 * 3. Sem arquivo local e sem storage configurado, respondemos **404** — nunca o
 *    HTML do fallback SPA (era o que fazia todas as imagens quebrarem).
 */
async function handleStorageRequest(
  req: express.Request,
  res: express.Response
) {
  try {
    const key = decodeURIComponent((req.url || "").replace(/^\/+/, ""));
    const isSafeKey =
      key.length > 0 && !key.includes("..") && !key.startsWith("/");

    if (!isSafeKey) {
      res.status(400).type("text/plain").send("Chave de imagem inválida");
      return;
    }

    if (!FORGE_BASE_URL || !FORGE_API_KEY) {
      res.status(404).type("text/plain").send("Imagem não encontrada");
      return;
    }

    const forgeUrl = new URL("v1/storage/presign/get", `${FORGE_BASE_URL}/`);
    forgeUrl.searchParams.set("path", key);

    const forgeResponse = await fetch(forgeUrl, {
      headers: { Authorization: `Bearer ${FORGE_API_KEY}` },
    });

    if (!forgeResponse.ok) {
      res.status(502).type("text/plain").send("Storage indisponível");
      return;
    }

    const { url } = (await forgeResponse.json()) as { url?: string };
    if (!url) {
      res.status(502).type("text/plain").send("URL assinada vazia");
      return;
    }

    // `no-store` evita que o browser cacheie o redirecionamento temporário.
    res.setHeader("Cache-Control", "no-store");
    res.redirect(307, url);
  } catch {
    res.status(404).type("text/plain").send("Imagem não encontrada");
  }
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
