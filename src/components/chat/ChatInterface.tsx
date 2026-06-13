"use client";

import { memo, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CrisisBanner } from "@/components/crisis/CrisisBanner";
import { sanitizeText } from "@/lib/sanitize";
import { appServices } from "@/lib/di/services";
import { debounce } from "@/lib/utils";
import type { ChatMessage, ExamType } from "@/types";
import { Send, Loader2, Bot, User } from "lucide-react";
import { generateId } from "@/lib/utils";

interface ChatInterfaceProps {
  examType: ExamType;
  userName: string;
  history: ChatMessage[];
  onSend: (message: string) => Promise<string>;
  onMessageAdded: (message: ChatMessage) => void;
}

/**
 * Adaptive companion chat with streaming-style UX and crisis safety.
 * @requirement Empathetic exam-aware AI companion with crisis safety
 * @param examType - User's target exam for personalized prompts
 * @param userName - Display name for chat personalization
 * @param history - Prior chat messages
 * @param onSend - Async API call to companion chat endpoint
 * @param onMessageAdded - Persist message to encrypted storage
 * @returns Chat UI with crisis banner and message list
 */
export const ChatInterface = memo(function ChatInterface({
  examType,
  userName,
  history,
  onSend,
  onMessageAdded,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [crisis, setCrisis] = useState(appServices.crisisDetector.detect(""));
  const bottomRef = useRef<HTMLDivElement>(null);

  const debouncedCrisisCheck = useMemo(
    () =>
      debounce((text: string) => {
        setCrisis(appServices.crisisDetector.detect(text));
      }, 300),
    [],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [history]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const crisisCheck = appServices.crisisDetector.detect(trimmed);
    setCrisis(crisisCheck);

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
      crisisDetected: crisisCheck.detected,
    };
    onMessageAdded(userMsg);
    setInput("");
    setIsLoading(true);

    try {
      if (appServices.crisisDetector.isAcute(crisisCheck)) {
        const crisisResponse: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content:
            "I hear that you're going through something incredibly painful right now, and I'm glad you told me. I'm an AI companion — not a therapist — and you deserve real human support. Please reach out to Tele-MANAS at 14416 (toll-free, 24/7) or iCall at 9152987821. You matter, and there are people who want to help.",
          createdAt: new Date().toISOString(),
          crisisDetected: true,
        };
        onMessageAdded(crisisResponse);
      } else {
        const response = await onSend(trimmed);
        const assistantMsg: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: response,
          createdAt: new Date().toISOString(),
        };
        onMessageAdded(assistantMsg);
      }
    } catch {
      onMessageAdded({
        id: generateId(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, onSend, onMessageAdded]);

  return (
    <div className="flex flex-col h-full" role="region" aria-label="Companion chat interface">
      <div
        className="flex-1 overflow-y-auto space-y-4 p-4 min-h-[300px] max-h-[500px]"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {history.length === 0 && (
          <p className="text-slate-400 text-sm text-center py-8">
            Hi {userName}! I&apos;m your MindMirror companion for {examType} prep. Ask me anything —
            study stress, motivation, or real-time tailored coping strategies.
          </p>
        )}
        {history.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            aria-label={`${msg.role === "user" ? "Your" : "Companion"} message`}
          >
            {msg.role === "assistant" && (
              <Bot className="h-6 w-6 text-violet-400 shrink-0 mt-1" aria-hidden="true" />
            )}
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-violet-600/30 text-slate-100"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              {sanitizeText(msg.content)}
            </div>
            {msg.role === "user" && (
              <User className="h-6 w-6 text-slate-400 shrink-0 mt-1" aria-hidden="true" />
            )}
          </div>
        ))}
        {isLoading && (
          <div
            className="flex gap-3"
            aria-live="polite"
            aria-busy="true"
            aria-label="Companion is typing"
          >
            <Bot className="h-6 w-6 text-violet-400 shrink-0" aria-hidden="true" />
            <div className="bg-slate-800 rounded-xl px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-violet-400" aria-hidden="true" />
              <span className="sr-only">MindMirror is typing</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {crisis.detected && (
        <div className="px-4 pb-2" role="region" aria-label="Crisis support resources">
          <CrisisBanner severity={crisis.severity === "acute" ? "acute" : "moderate"} />
        </div>
      )}

      <div
        className="p-4 border-t border-slate-800 flex gap-2"
        role="form"
        aria-label="Companion message input form"
      >
        <Textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            debouncedCrisisCheck(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
          placeholder="Share what's on your mind..."
          aria-label="Type your message to the AI companion"
          rows={2}
          className="min-h-[60px] resize-none"
          disabled={isLoading}
        />
        <Button
          onClick={() => void handleSend()}
          disabled={isLoading || !input.trim()}
          aria-label="Send chat message to companion"
          className="self-end"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
});
