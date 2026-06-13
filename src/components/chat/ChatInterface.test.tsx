import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChatInterface } from "@/components/chat/ChatInterface";

describe("ChatInterface", () => {
  it("renders with accessible chat region", () => {
    render(
      <ChatInterface
        examType="NEET"
        userName="Priya"
        history={[]}
        onSend={vi.fn().mockResolvedValue("Hello")}
        onMessageAdded={vi.fn()}
      />,
    );
    expect(screen.getByRole("region", { name: /companion chat interface/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/type your message/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send chat message to companion/i }),
    ).toBeInTheDocument();
  });
});
