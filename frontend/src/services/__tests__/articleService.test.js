import { describe, it, expect, vi, afterEach } from "vitest";
import mockArticles from "../../data/mockData";

vi.mock("../../utils/debugUtils.js", () => ({
  debugLog: vi.fn(),
  debugError: vi.fn(),
  isDebugEnabled: () => false,
}));

vi.mock("../apiClient", () => ({
  default: {
    get: vi.fn(),
  },
}));

const loadService = async (envValue) => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  if (envValue) {
    vi.stubEnv("VITE_APP_ENVIRONMENT", envValue);
  }

  const { fetchArticles } = await import("../articleService.js");
  const apiModule = await import("../apiClient.js");
  const debugModule = await import("../../utils/debugUtils.js");

  return {
    fetchArticles,
    apiClient: apiModule.default,
    debugModule,
  };
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("articleService.fetchArticles", () => {
  it("returns mock data in staging without hitting API", async () => {
    const { fetchArticles, apiClient } = await loadService("staging");

    const result = await fetchArticles({
      url: "https://www.americanlibertymedia.com",
    });

    expect(apiClient.get).not.toHaveBeenCalled();
    expect(result.length).toBeGreaterThan(0);
    expect(
      result.every(
        (article) => article.site === "https://www.americanlibertymedia.com",
      ),
    ).toBe(true);
    expect(result[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      summary: expect.any(Array),
    });
  });

  it("fetches and filters backend data when not staging", async () => {
    const { fetchArticles, apiClient } = await loadService("production");

    const apiArticles = [
      {
        _id: "a1",
        title: "Primary",
        site: "https://example.com",
        publishDate: "2025-02-15T00:00:00.000Z",
        summary: ["Point"],
        url: "https://example.com/article",
      },
      {
        _id: "a2",
        title: "Other",
        site: "https://other.com",
        publishDate: "2024-12-01T00:00:00.000Z",
      },
    ];

    apiClient.get.mockResolvedValue({ data: { data: apiArticles } });

    const result = await fetchArticles({ url: "https://example.com/" });

    expect(apiClient.get).toHaveBeenCalledWith("/api/articles/mongo", {
      params: {
        limit: 20,
        site: "https://example.com/",
      },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "a1",
      title: "Primary",
      url: "https://example.com/article",
      publishDate: "2025-02-15T00:00:00.000Z",
    });
  });

  it("returns [] and logs when API call fails", async () => {
    const { fetchArticles, apiClient, debugModule } = await loadService(
      "production",
    );

    apiClient.get.mockRejectedValue(new Error("boom"));

    const result = await fetchArticles({ url: "https://example.com" });

    expect(result).toEqual([]);
    expect(debugModule.debugError).toHaveBeenCalled();
  });

  it("normalizes using mock data shape", async () => {
    const { fetchArticles } = await loadService("staging");

    const siteUrl = mockArticles[0].site;
    const result = await fetchArticles({ url: siteUrl });

    const sortedByDate = [...result].sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
    );
    expect(result).toEqual(sortedByDate);
  });
});
