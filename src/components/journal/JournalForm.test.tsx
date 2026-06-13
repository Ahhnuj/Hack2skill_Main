import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JournalForm } from "@/components/journal/JournalForm";

describe("JournalForm", () => {
  it("renders mood selector and textarea", () => {
    render(<JournalForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/what's on your mind/i)).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: /mood level/i })).toBeInTheDocument();
  });

  it("shows crisis banner for distress language", async () => {
    const user = userEvent.setup();
    render(<JournalForm onSubmit={vi.fn()} />);
    const textarea = screen.getByLabelText(/what's on your mind/i);
    await user.type(textarea, "I feel hopeless and overwhelmed");
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("calls onSubmit with content and mood", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<JournalForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/what's on your mind/i), "Good study day");
    await user.click(screen.getByRole("radio", { name: /mood 4/i }));
    await user.click(screen.getByRole("button", { name: /save journal entry/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith("Good study day", 4);
    });
  });

  it("disables submit when content is empty", () => {
    render(<JournalForm onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /save journal entry/i })).toBeDisabled();
  });
});
