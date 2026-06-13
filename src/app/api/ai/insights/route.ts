import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { insightRequestSchema } from "@/lib/schemas";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { buildInsightPrompt } from "@/features/ai/prompts/insights";
import { parseInsightResponse, getDemoInsight } from "@/features/ai/parsers/insights";
import { generateId } from "@/lib/utils";

export const runtime = "nodejs";

/**
 * POST /api/ai/insights — Mirror Insights pattern analysis
 * Server-side only. Rate-limited. Zod-validated.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait before trying again." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = insightRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { entries, examType, userName } = parsed.data;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    const demo = getDemoInsight(examType);
    return NextResponse.json({
      id: generateId(),
      ...demo,
      generatedAt: new Date().toISOString(),
      demo: true,
    });
  }

  try {
    const client = new Anthropic({ apiKey });
    const { system, user } = buildInsightPrompt({
      userName,
      examType,
      entries,
    });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: user }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const rawText = textBlock?.type === "text" ? textBlock.text : "";

    const journalEntries = entries.map((e, i) => ({
      id: String(i),
      content: e.content,
      mood: e.mood,
      createdAt: e.createdAt,
      updatedAt: e.createdAt,
    }));

    const insight = parseInsightResponse(rawText, journalEntries);

    return NextResponse.json({
      id: generateId(),
      ...insight,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Insight API error:", error);
    const demo = getDemoInsight(examType);
    return NextResponse.json({
      id: generateId(),
      ...demo,
      generatedAt: new Date().toISOString(),
      fallback: true,
    });
  }
}
