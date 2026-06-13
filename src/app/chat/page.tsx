"use client";

import dynamic from "next/dynamic";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/AppProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DISCLAIMER } from "@/lib/constants";
import { useChatMutation } from "@/hooks/useMirrorInsight";

const ChatInterface = dynamic(
  () => import("@/components/chat/ChatInterface").then((m) => m.ChatInterface),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-64 flex items-center justify-center text-slate-500"
        role="status"
        aria-label="Loading companion chat"
      >
        Loading companion...
      </div>
    ),
  },
);

export default function ChatPage() {
  const router = useRouter();
  const { state, isLoading, addChatMessage } = useApp();
  const chatMutation = useChatMutation();

  useEffect(() => {
    if (!isLoading && !state.profile) {
      router.replace("/onboarding");
    }
  }, [isLoading, state.profile, router]);

  const handleSend = useCallback(
    async (message: string): Promise<string> => {
      return chatMutation.mutateAsync({
        message,
        examType: state.profile!.examType,
        userName: state.profile!.name,
        history: state.chatHistory.slice(-10).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        journalContext: state.entries.slice(0, 3).map((e) => e.content.slice(0, 200)),
      });
    },
    [chatMutation, state.profile, state.chatHistory, state.entries],
  );

  if (isLoading || !state.profile) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        role="status"
        aria-label="Loading chat page"
      >
        <p className="text-slate-400" aria-live="polite">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">AI Companion</h1>
        <p className="text-slate-400 mt-1">
          Hyper-personalized, contextual coping strategies — empathetic, always-available support
          for {state.profile.examType} prep.
        </p>
      </header>

      <Card role="region" aria-label="MindMirror companion chat">
        <CardHeader className="pb-0">
          <CardTitle>MindMirror Chat</CardTitle>
          <CardDescription>{DISCLAIMER}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ChatInterface
            examType={state.profile.examType}
            userName={state.profile.name}
            history={state.chatHistory}
            onSend={handleSend}
            onMessageAdded={(msg) => void addChatMessage(msg)}
          />
        </CardContent>
      </Card>
    </AppShell>
  );
}
