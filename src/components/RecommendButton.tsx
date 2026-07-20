"use client";

import { useCallback, useEffect, useState } from "react";

import { trackEvent } from "@/lib/analytics";

export interface RecommendationStore {
  hasRecommended(postId: number): Promise<boolean>;
  saveRecommendation(postId: number): Promise<void>;
}

const STORAGE_KEY = "aam-recommendations";

function isStorageEnabled(): boolean {
  return process.env.NEXT_PUBLIC_RECOMMENDATIONS_STORAGE_ENABLED !== "false";
}

class LocalRecommendationStore implements RecommendationStore {
  private read(): number[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed)
        ? parsed.filter((value): value is number => typeof value === "number")
        : [];
    } catch {
      return [];
    }
  }

  private write(ids: number[]): void {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }

  async hasRecommended(postId: number): Promise<boolean> {
    return this.read().includes(postId);
  }

  async saveRecommendation(postId: number): Promise<void> {
    const ids = this.read();
    if (!ids.includes(postId)) {
      this.write([...ids, postId]);
    }
  }
}

const localStore = new LocalRecommendationStore();

type RecommendButtonProps = {
  postId: number;
  className?: string;
};

export function RecommendButton({ postId, className = "" }: RecommendButtonProps) {
  const [recommended, setRecommended] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let active = true;
    void localStore.hasRecommended(postId).then((value) => {
      if (active) {
        setRecommended(value);
        setReady(true);
      }
    });
    return () => {
      active = false;
    };
  }, [postId]);

  const handleClick = useCallback(async () => {
    if (recommended || !isStorageEnabled()) return;
    await localStore.saveRecommendation(postId);
    setRecommended(true);
    trackEvent("recommend_click", { post_id: postId });
  }, [postId, recommended]);

  return (
    <button
      type="button"
      className={`recommend-button${recommended ? " is-recommended" : ""}${reduceMotion ? " reduce-motion" : ""} ${className}`.trim()}
      aria-pressed={recommended}
      aria-label={recommended ? "Recommended" : "Recommend this story"}
      title={recommended ? "Recommended" : "Recommend this story"}
      disabled={!ready || recommended || !isStorageEnabled()}
      onClick={handleClick}
    >
      {recommended ? "Recommended" : "Recommend"}
    </button>
  );
}

export { localStore as recommendationStore };
