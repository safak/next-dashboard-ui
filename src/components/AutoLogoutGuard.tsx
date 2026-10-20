"use client";

import { useAutoLogout } from "@/hooks/useAutoLogout";
import InactivityWarning from "./InactivityWarning";

export default function AutoLogoutGuard() {
  const { showWarning, stayLoggedIn } = useAutoLogout();

  if (!showWarning) return null;

  return <InactivityWarning onStay={stayLoggedIn} />;
}
