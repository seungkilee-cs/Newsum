import { describe, it, expect, vi } from "vitest";
import { sites as mockSites } from "../../data/siteData";

vi.mock("../../utils/debugUtils", () => ({
  debugLog: vi.fn(),
  debugError: vi.fn(),
  isDebugEnabled: () => false,
}));

vi.mock("../apiClient", () => ({
  default: {
    get: vi.fn(),
  },
}));

const CONFIG_PATH = "../../constants/config.js";
const baseConfig = {
  siteEndpoint: "/api/sites",
  articleEndpoint: "/api/articles/mongo",
  apiBaseUrl: "http://localhost:5001",
  authEndpoints: {},
};

const loadSiteService = async (overrides) => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.doMock(CONFIG_PATH, () => ({
    ...baseConfig,
    ...overrides,
  }));

  const { fetchSites } = await import("../siteService.js");
  const apiModule = await import("../apiClient.js");

  vi.doUnmock(CONFIG_PATH);

  return { fetchSites, apiClient: apiModule.default };
};

describe("siteService", () => {
  it("returns static sites in staging", async () => {
    const { fetchSites, apiClient } = await loadSiteService({ isStaging: true });

    const result = await fetchSites();

    expect(result).toEqual(mockSites);
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it("fetches sites from backend in production", async () => {
    const { fetchSites, apiClient } = await loadSiteService({ isStaging: false });

    const data = [{ name: "Sample", url: "https://example.com" }];
    apiClient.get.mockResolvedValue({ data });

    const result = await fetchSites();

    expect(apiClient.get).toHaveBeenCalled();
    expect(result).toEqual(data);
  });

  it("returns [] on network failure", async () => {
    const { fetchSites, apiClient } = await loadSiteService({ isStaging: false });

    apiClient.get.mockRejectedValue(new Error("Network"));

    const result = await fetchSites();

    expect(result).toEqual([]);
  });
});
