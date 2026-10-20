"use client";

import { useState } from "react";
import { SignOutButton } from "@clerk/nextjs";

export default function ConfirmLogout() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Logout button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center
                   rounded-lg px-4 py-2 text-sm font-medium
                   border border-red-300 text-red-600 bg-white
                   hover:bg-red-50 hover:border-red-400 transition"
      >
        Logout
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Sign out?
            </h3>

            <p className="text-sm text-gray-500">
              Are you sure you want to sign out of your account?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm font-medium
                           rounded-lg border border-gray-300
                           text-gray-700 bg-white
                           hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <SignOutButton redirectUrl="/">
                <button
                  className="px-4 py-2 text-sm font-medium
                             rounded-lg bg-red-600 text-white
                             hover:bg-red-700 transition"
                >
                  Sign out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
