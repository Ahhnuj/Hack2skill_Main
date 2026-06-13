import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CrisisBanner } from "@/components/crisis/CrisisBanner";

describe("CrisisBanner", () => {
  it("shows Tele-MANAS helpline for acute severity", () => {
    render(<CrisisBanner severity="acute" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByLabelText(/Call Tele-MANAS/i)).toHaveTextContent("14416");
  });

  it("shows helplines for moderate severity", () => {
    render(<CrisisBanner severity="moderate" />);
    expect(screen.getByLabelText(/Call iCall/i)).toBeInTheDocument();
  });
});
