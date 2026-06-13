"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { MoodOrb } from "@/components/layout/MoodOrb";
import { useApp } from "@/providers/AppProvider";
import { BookOpen, LayoutDashboard, MessageCircle, Wind, Settings } from "lucide-react";
import type { MoodLevel } from "@/types";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/chat", label: "Companion", icon: MessageCircle },
  { href: "/mindfulness", label: "Mindfulness", icon: Wind },
  { href: "/settings", label: "Settings", icon: Settings },
];

/** @requirement Accessible main navigation for all students */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useApp();
  const recentMood = (state.entries[0]?.mood ?? 3) as MoodLevel;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950">
      <a
        href="#main-content"
        aria-label="Skip to main content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      <header className="border-b border-slate-800/60 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/dashboard"
            aria-label="MindMirror home dashboard"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-lg"
          >
            <MoodOrb mood={recentMood} size="sm" />
            <span className="font-semibold text-slate-100">{APP_NAME}</span>
          </Link>
          {state.profile && (
            <p className="text-sm text-slate-400 hidden sm:block">
              {state.profile.name} · {state.profile.examType}
            </p>
          )}
        </div>
      </header>

      <nav className="border-b border-slate-800/40" aria-label="Main navigation">
        <div className="max-w-5xl mx-auto px-4">
          <ul className="flex gap-1 overflow-x-auto py-2">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-label={`Navigate to ${label}`}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
                    pathname === href
                      ? "bg-violet-600/20 text-violet-300"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                  )}
                  aria-current={pathname === href ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main id="main-content" className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
