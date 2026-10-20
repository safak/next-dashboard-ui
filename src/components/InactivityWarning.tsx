"use client";

import { useEffect, useState } from "react";

const COUNTDOWN_SECONDS = 30;

export default function InactivityWarning({
  onStay,
}: {
  onStay: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    setSecondsLeft(COUNTDOWN_SECONDS);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md space-y-5 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 text-center">
          Session Expiring
        </h3>

        <p className="text-sm text-gray-600 text-center">
          You’ll be logged out due to inactivity in
        </p>

        {/* COUNTDOWN */}
        <div className="text-center">
          <span className="inline-flex items-center justify-center
                           rounded-full bg-red-50 border border-red-200
                           px-4 py-2 text-xl font-semibold text-red-600">
            {secondsLeft}s
          </span>
        </div>

        <button
          onClick={onStay}
          className="w-full rounded-lg bg-blue-600 text-white py-2.5
                     text-sm font-medium hover:bg-blue-700 transition"
        >
          Stay Logged In
        </button>
      </div>
    </div>
  );
}
