import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Site from "../Site";

const sampleSites = [
  {
    _id: "1",
    name: "American Liberty Media",
    url: "https://www.americanlibertymedia.com",
    image: "alm.avif",
  },
  {
    _id: "2",
    name: "CNN",
    url: "https://www.cnn.com",
    image: "cnn.svg",
  },
];

describe("Site", () => {
  it("renders loading state", () => {
    render(<Site isLoading sites={[]} onSiteSelect={vi.fn()} />, {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/sites"]}>{children}</MemoryRouter>
      ),
    });

    expect(screen.getByText("Loading sites...")).toBeInTheDocument();
  });

  it("renders empty state when no sites provided", () => {
    render(<Site sites={[]} onSiteSelect={vi.fn()} />, {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/sites"]}>{children}</MemoryRouter>
      ),
    });

    expect(
      screen.getByText("No sites available. Please try again later."),
    ).toBeInTheDocument();
  });

  it("renders site cards and handles selection", () => {
    const handleSelect = vi.fn();

    render(<Site sites={sampleSites} onSiteSelect={handleSelect} />, {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/sites"]}>
          <Routes>
            <Route path="/sites" element={children} />
            <Route path="/site/:siteName" element={<div>Carousel</div>} />
          </Routes>
        </MemoryRouter>
      ),
    });

    expect(screen.getByText("American Liberty Media")).toBeInTheDocument();
    expect(screen.getByText("CNN")).toBeInTheDocument();

    fireEvent.click(screen.getByText("American Liberty Media"));

    expect(handleSelect).toHaveBeenCalledWith(sampleSites[0]);
    expect(screen.getByText("Carousel")).toBeInTheDocument();
  });
});
