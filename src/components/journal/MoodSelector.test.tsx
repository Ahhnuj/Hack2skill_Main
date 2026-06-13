import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MoodSelector } from "@/components/journal/MoodSelector";

describe("MoodSelector accessibility", () => {
  it("renders radiogroup with aria-label", () => {
    render(<MoodSelector value={3} onChange={() => {}} />);
    expect(screen.getByRole("radiogroup", { name: /mood level/i })).toBeInTheDocument();
  });

  it("each mood button has aria-label", () => {
    render(<MoodSelector value={3} onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: /mood 1/i })).toHaveAttribute("aria-label");
    expect(screen.getByRole("radio", { name: /mood 5/i })).toHaveAttribute("aria-label");
  });

  it("calls onChange when mood selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MoodSelector value={3} onChange={onChange} />);
    await user.click(screen.getByRole("radio", { name: /mood 4/i }));
    expect(onChange).toHaveBeenCalledWith(4);
  });
});
