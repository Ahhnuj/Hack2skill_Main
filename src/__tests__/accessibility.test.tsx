import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { CrisisBanner } from "@/components/crisis/CrisisBanner";
import { MoodSelector } from "@/components/journal/MoodSelector";
import { AppShell } from "@/components/layout/AppShell";
import { AppProvider } from "@/providers/AppProvider";

describe("accessibility (axe)", () => {
  it("CrisisBanner has no axe violations", async () => {
    const { container } = render(<CrisisBanner severity="moderate" />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("MoodSelector has no axe violations", async () => {
    const { container } = render(<MoodSelector value={3} onChange={() => {}} />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("AppShell navigation has no axe violations", async () => {
    const { container } = render(
      <AppProvider>
        <AppShell>
          <p>Main content</p>
        </AppShell>
      </AppProvider>,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
