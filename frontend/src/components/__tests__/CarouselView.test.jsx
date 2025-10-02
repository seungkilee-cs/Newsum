import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CarouselView from "../CarouselView";

vi.mock("swiper/react", () => ({
  Swiper: ({ children }) => <div data-testid="swiper">{children}</div>,
  SwiperSlide: ({ children }) => <div data-testid="swiper-slide">{children}</div>,
}));

vi.mock("swiper/modules", () => ({
  EffectCoverflow: vi.fn(),
  Navigation: vi.fn(),
}));

vi.mock("../../services/articleService", () => ({
  fetchArticles: vi.fn(),
}));

import { fetchArticles } from "../../services/articleService";

const renderWithRouter = (ui, { route = "/site/american-liberty-media" } = {}) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/site/:siteName" element={ui} />
      </Routes>
    </MemoryRouter>,
  );

describe("CarouselView", () => {
  const sampleSite = {
    name: "American Liberty Media",
    url: "https://www.americanlibertymedia.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders articles returned from fetch", async () => {
    fetchArticles.mockResolvedValue([
      {
        id: "1",
        title: "Sample Article",
        author: "Author",
        publishDateLabel: "Feb 15, 2025",
        summary: ["Point 1", "Point 2"],
        url: "https://example.com/article",
        site: sampleSite.url,
      },
    ]);

    renderWithRouter(
      <CarouselView site={sampleSite} getSelectedSiteFromURL={() => sampleSite} />,
    );

    expect(await screen.findByText("Sample Article")).toBeInTheDocument();
    expect(fetchArticles).toHaveBeenCalledWith(sampleSite);
  });

  it("shows error message when service throws", async () => {
    fetchArticles.mockRejectedValue(new Error("Network error"));

    renderWithRouter(
      <CarouselView site={sampleSite} getSelectedSiteFromURL={() => sampleSite} />,
    );

    expect(await screen.findByText("Failed to load articles. Please try again later.")).toBeInTheDocument();
  });

  it("shows empty message when no articles returned", async () => {
    fetchArticles.mockResolvedValue([]);

    renderWithRouter(
      <CarouselView site={sampleSite} getSelectedSiteFromURL={() => sampleSite} />,
    );

    expect(
      await screen.findByText("No articles found for this site."),
    ).toBeInTheDocument();
  });

  it("shows error when no site available", async () => {
    fetchArticles.mockResolvedValue([]);
    const selector = vi.fn().mockReturnValue(undefined);

    renderWithRouter(<CarouselView site={null} getSelectedSiteFromURL={selector} />);

    expect(await screen.findByText("No site selected.")).toBeInTheDocument();
  });
});
