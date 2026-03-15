"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import type { ProfileSummary } from "./types";

export function useProfileSummary(email?: string) {
  const [summary, setSummary] = useState<ProfileSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      setSummary(null);
      return;
    }

    let ignore = false;

    const loadSummary = async () => {
      try {
        setSummaryLoading(true);
        const response = await axios.get(`/api/profile-summary/${encodeURIComponent(email)}`);
        if (!ignore) {
          setSummary(response.data ?? null);
        }
      } catch {
        if (!ignore) {
          setSummary(null);
        }
      } finally {
        if (!ignore) {
          setSummaryLoading(false);
        }
      }
    };

    loadSummary();

    return () => {
      ignore = true;
    };
  }, [email]);

  return { summary, summaryLoading };
}
