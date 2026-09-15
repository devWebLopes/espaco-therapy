import { describe, expect, it, vi } from "vitest";

import {
  extractStorageKey,
  isSafeStorageKey,
  readStorageCredentials,
  resolveStorageResponse,
} from "./storage";

const CREDENTIALS = {
  baseUrl: "https://storage.exemplo.com",
  apiKey: "chave-de-teste",
};

/** Resposta mínima compatível com o que `resolveStorageResponse` consome. */
function jsonResponse(body: unknown, ok = true): Response {
  return { ok, json: async () => body } as unknown as Response;
}

describe("readStorageCredentials", () => {
  it("normaliza a barra final da URL base", () => {
    expect(
      readStorageCredentials({
        BUILT_IN_FORGE_API_URL: "https://storage.exemplo.com///",
        BUILT_IN_FORGE_API_KEY: "abc",
      })
    ).toEqual({ baseUrl: "https://storage.exemplo.com", apiKey: "abc" });
  });

  it("devolve base vazia quando as envs não estão definidas", () => {
    expect(readStorageCredentials({})).toEqual({
      baseUrl: "",
      apiKey: undefined,
    });
  });
});

describe("isSafeStorageKey", () => {
  it("aceita chave relativa simples", () => {
    expect(isSafeStorageKey("massagem_1086f446.jpg")).toBe(true);
  });

  it("rejeita chave vazia, absoluta ou com path traversal", () => {
    expect(isSafeStorageKey("")).toBe(false);
    expect(isSafeStorageKey("/etc/passwd")).toBe(false);
    expect(isSafeStorageKey("../../.env")).toBe(false);
  });
});

describe("extractStorageKey", () => {
  it("extrai a chave de uma URL montada no Express", () => {
    expect(extractStorageKey("/massagem_1086f446.jpg", "/manus-storage/")).toBe(
      "massagem_1086f446.jpg"
    );
  });

  it("extrai a chave da URL reescrita pela Vercel", () => {
    expect(
      extractStorageKey(
        "/api/manus-storage/mechas_fa72dfb6.jpg",
        "/manus-storage/"
      )
    ).toBe("mechas_fa72dfb6.jpg");
  });

  it("ignora query string", () => {
    expect(
      extractStorageKey("/api/manus-storage/foto.jpg?v=2", "/manus-storage/")
    ).toBe("foto.jpg");
  });
});

describe("resolveStorageResponse", () => {
  it("responde 400 para chave inválida", async () => {
    await expect(
      resolveStorageResponse("/..%2F.env", CREDENTIALS)
    ).resolves.toEqual({ status: 400, message: "Chave de imagem inválida" });
  });

  it("responde 404 sem credenciais do storage", async () => {
    await expect(
      resolveStorageResponse("massagem.jpg", { baseUrl: "" })
    ).resolves.toEqual({ status: 404, message: "Imagem não encontrada" });
  });

  it("responde 307 com a URL assinada do storage", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () =>
      jsonResponse({ url: "https://cdn.exemplo.com/assinada.jpg" })
    );

    await expect(
      resolveStorageResponse("/massagem_1086f446.jpg", CREDENTIALS, fetchImpl)
    ).resolves.toEqual({
      status: 307,
      location: "https://cdn.exemplo.com/assinada.jpg",
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [requested, init] = fetchImpl.mock.calls[0];
    expect(String(requested)).toBe(
      "https://storage.exemplo.com/v1/storage/presign/get?path=massagem_1086f446.jpg"
    );
    expect((init?.headers as Record<string, string>).Authorization).toBe(
      "Bearer chave-de-teste"
    );
  });

  it("responde 502 quando o storage falha", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => jsonResponse({}, false));

    await expect(
      resolveStorageResponse("massagem.jpg", CREDENTIALS, fetchImpl)
    ).resolves.toEqual({ status: 502, message: "Storage indisponível" });
  });

  it("responde 502 quando a URL assinada vem vazia", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => jsonResponse({}));

    await expect(
      resolveStorageResponse("massagem.jpg", CREDENTIALS, fetchImpl)
    ).resolves.toEqual({ status: 502, message: "URL assinada vazia" });
  });

  it("responde 404 quando a requisição ao storage lança erro", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => {
      throw new Error("falha de rede");
    });

    await expect(
      resolveStorageResponse("massagem.jpg", CREDENTIALS, fetchImpl)
    ).resolves.toEqual({ status: 404, message: "Imagem não encontrada" });
  });
});
