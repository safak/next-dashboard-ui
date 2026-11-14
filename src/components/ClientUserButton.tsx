"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

// Clerk's UserButton renders nothing on the server but can render its
// container on the first client render if clerk-js loaded before hydration,
// causing a hydration mismatch. Mounting it only after hydration avoids that.
const ClientUserButton = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-7 h-7" />;

  return <UserButton />;
};

export default ClientUserButton;
