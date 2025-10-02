import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("shows guest CTA on home page", () => {
    window.history.pushState({}, "Test", "/Newsum/");

    render(<App />);

    expect(screen.getByText("Continue as Guest")).toBeInTheDocument();
  });
});
