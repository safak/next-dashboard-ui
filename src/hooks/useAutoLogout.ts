"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useClerk } from "@clerk/nextjs";

const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes
const WARNING_DURATION = 30 * 1000; // 30 seconds

export function useAutoLogout() {
  const { signOut } = useClerk();

  const inactivityTimer = useRef<number>();
  const warningTimer = useRef<number>();
  const lastActivity = useRef(Date.now());

  const [showWarning, setShowWarning] = useState(false);

  const clearTimers = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
  }, []);

  const startTimers = useCallback(() => {
    clearTimers();

    inactivityTimer.current = window.setTimeout(() => {
      setShowWarning(true);

      warningTimer.current = window.setTimeout(() => {
        signOut({ redirectUrl: "/" });
      }, WARNING_DURATION);
    }, INACTIVITY_LIMIT);
  }, [clearTimers, signOut]);

  const recordActivity = useCallback(() => {
    // Ignore activity while warning is shown
    if (showWarning) return;

    lastActivity.current = Date.now();
    startTimers();
  }, [showWarning, startTimers]);

  const stayLoggedIn = useCallback(() => {
    setShowWarning(false);
    lastActivity.current = Date.now();
    startTimers();
  }, [startTimers]);

  useEffect(() => {
    startTimers();

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

    events.forEach((e) =>
      window.addEventListener(e, recordActivity, { passive: true })
    );

    const handleVisibility = () => {
      if (!document.hidden) {
        recordActivity();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearTimers();
      events.forEach((e) =>
        window.removeEventListener(e, recordActivity)
      );
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [recordActivity, startTimers, clearTimers]);

  return {
    showWarning,
    stayLoggedIn,
  };
}
