"use client";

import { useEffect } from "react";
import { updateAdminLastActive } from "@/lib/actions";

export function useLastActive(userId: string) {
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    const markActive = () => {
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        updateAdminLastActive(userId);
      }, 3000); // debounce (3 seconds)
    };

    // User interactions
    window.addEventListener("mousemove", markActive);
    window.addEventListener("keydown", markActive);
    window.addEventListener("click", markActive);
    window.addEventListener("scroll", markActive);

    // Mark active on mount
    markActive();

    return () => {
      if (timeout) clearTimeout(timeout);
      window.removeEventListener("mousemove", markActive);
      window.removeEventListener("keydown", markActive);
      window.removeEventListener("click", markActive);
      window.removeEventListener("scroll", markActive);
    };
  }, [userId]);
}
