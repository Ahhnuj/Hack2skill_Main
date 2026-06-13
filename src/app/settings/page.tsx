"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/AppProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CrisisBanner } from "@/components/crisis/CrisisBanner";
import { DISCLAIMER } from "@/lib/constants";
import { Trash2, Shield, Cloud } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { state, isLoading, clearAllData, cloudSyncEnabled } = useApp();
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!isLoading && !state.profile) {
      router.replace("/onboarding");
    }
  }, [isLoading, state.profile, router]);

  if (isLoading || !state.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400" aria-live="polite">
          Loading...
        </p>
      </div>
    );
  }

  const handleDelete = async () => {
    await clearAllData();
    router.replace("/");
  };

  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Settings & Privacy</h1>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-violet-400" aria-hidden="true" />
              Privacy
            </CardTitle>
            <CardDescription>{DISCLAIMER}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-400">
            <p>
              Your journal data is encrypted at rest using AES-GCM (Web Crypto API) and stored
              locally on this device.
            </p>
            {cloudSyncEnabled ? (
              <p className="flex items-center gap-2 text-emerald-400">
                <Cloud className="h-4 w-4" aria-hidden="true" />
                Cloud backup enabled — encrypted blobs sync to Supabase via secure server API.
              </p>
            ) : (
              <p className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-slate-500" aria-hidden="true" />
                Cloud backup off — local-only mode. Add Supabase env vars to enable sync when
                deploying.
              </p>
            )}
            <p>No PII is sent to third parties beyond anonymized journal text for AI analysis.</p>
            <p>
              Profile: {state.profile.name} · {state.profile.examType}
            </p>
            <p>
              Consent given: {new Date(state.profile.consentTimestamp).toLocaleDateString("en-IN")}
            </p>
          </CardContent>
        </Card>

        <CrisisBanner severity="moderate" />

        <Card className="border-red-900/50">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <Trash2 className="h-5 w-5" aria-hidden="true" />
              Delete All My Data
            </CardTitle>
            <CardDescription>
              Permanently remove all journal entries, chat history, and insights from this device.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!confirmDelete ? (
              <Button
                variant="destructive"
                aria-label="Delete all MindMirror data"
                onClick={() => setConfirmDelete(true)}
              >
                Delete All Data
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-red-300" role="alert">
                  Are you sure? This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="destructive"
                    aria-label="Confirm delete all data"
                    onClick={() => void handleDelete()}
                  >
                    Yes, delete everything
                  </Button>
                  <Button
                    variant="secondary"
                    aria-label="Cancel data deletion"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
