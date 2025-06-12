'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
  // We don't pass the session here as SessionProvider fetches it
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // The SessionProvider component takes care of fetching the session
  return <SessionProvider>{children}</SessionProvider>;
}
