import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { chatRequestSchema } from "@/lib/schemas";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { buildChatPrompt } from "@/features/ai/prompts/chat";
import { detectCrisis, isAcuteCrisis } from "@/features/crisis/detector";

export const runtime = "nodejs";

const CRISIS_RESPONSE =
  "I hear that you're going through something incredibly painful right now. I'm an AI companion — not a therapist. Please reach out to Tele-MANAS at 14416 (toll-free, 24/7), iCall at 9152987821, or AASRA at 9820466726. You matter, and real support is available.";

/**
 * POST /api/ai/chat — Empathetic companion chat with streaming
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rateLimit = checkRateLimit(`chat-${ip}`);
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": "60" },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Validation failed", details: parsed.error.flatten() }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const { message, examType, userName, history, journalContext } = parsed.data;

  const crisis = detectCrisis(message);
  if (isAcuteCrisis(crisis)) {
    return new Response(CRISIS_RESPONSE, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    const demoResponse = getDemoChatResponse(message, examType, userName);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(demoResponse));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  try {
    const client = new Anthropic({ apiKey });
    const { system, messages } = buildChatPrompt({
      userName,
      examType,
      message,
      history,
      journalContext,
    });

    const anthropicStream = await client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system,
      messages,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const event of anthropicStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      "I'm having trouble connecting right now. Take a deep breath — you're doing okay. Please try again in a moment.",
      { headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }
}

function getDemoChatResponse(message: string, examType: string, userName: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("stress") || lower.includes("anxious")) {
    return `Hey ${userName}, I hear you — ${examType} prep stress is real, and naming it takes courage. Based on your journal patterns, your anxiety often peaks the night BEFORE mocks, not during them. Tonight, try this: write down 3 topics you already know well, then do 4 rounds of 4-7-8 breathing. You're not behind — you're human, and you're still showing up. That counts for a lot.`;
  }
  if (lower.includes("motivat") || lower.includes("give up")) {
    return `${userName}, the fact that you're asking for motivation while carrying the weight of ${examType} tells me you're stronger than you feel right now. Every student who cleared this exam had nights exactly like this one. Your job tonight isn't to solve everything — it's to rest enough to try again tomorrow. One chapter. One question. One breath at a time.`;
  }
  return `Thanks for sharing that, ${userName}. As your ${examType} wellness companion, I'm here whenever you need to talk — about study pressure, comparison, sleep, or anything else. What's weighing on you most right now?`;
}
