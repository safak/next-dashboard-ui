"use client";

import { useLastActive } from "@/hooks/useLastActive";

export default function ProfileActivityTracker({
  userId,
}: {
  userId: string;
}) {
  useLastActive(userId);
  return null;
}
