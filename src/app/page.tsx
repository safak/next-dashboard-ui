// src/app/page.tsx
"use client"; // Add this line to make this a Client Component

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Homepage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the signup page
    router.push("/auth/signup");
  }, [router]);

  return <div>Redirecting...</div>; // Optional: Show a loading message before redirect
};

export default Homepage;
