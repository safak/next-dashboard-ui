"use client";

import { useRouter } from "next/navigation";
import { Check, Printer, Download, LayoutDashboard, Plus } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  studentId: string | null;
  onClose: () => void;
}

export default function AdmissionSuccessDialog({
  open,
  studentId,
  onClose,
}: Props) {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigate = (url: string) => {
    onClose();
    router.push(url);
  };

  // ✅ All hooks have already run
  if (!mounted || !open || !studentId) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30 backdrop-blur-md animate-in fade-in duration-300 p-4">
      {/* your existing dialog */}
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500 ease-out">
        {/* Top Decoration */}

        <div className="relative flex justify-center pt-10">
          {/* Decorative Dots */}

          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-10 top-8 h-2 w-2 rounded-full bg-green-400 opacity-80 animate-pulse" />
            <div className="absolute left-24 top-10 h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            <div className="absolute right-16 top-8 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <div className="absolute right-24 top-16 h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse" />
            <div className="absolute left-1/2 top-4 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          </div>

          {/* Success Icon */}

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50 animate-success-float">
            <Check className="h-8 w-8 text-green-600 animate-in zoom-in duration-500 delay-300"/>
          </div>
        </div>

        {/* Content */}

        <div className="px-8 pt-8 pb-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 animate-in fade-in 
          slide-in-from-bottom-2 duration-500 delay-300">
            Admission Successful!
          </h2>

          <p className="mt-3 text-xs leading-5 text-slate-600 animate-in fade-in 
          slide-in-from-bottom-2 duration-500 delay-500">
            Student admission has been completed successfully. You can now print
            the admission form, download the admission summary or continue
            managing admissions.
          </p>
        </div>

        {/* Buttons */}

        <div className="space-y-3 px-8 pb-8">
          <button
            onClick={() =>
              navigate(`/admin/students/${studentId}/admission-form`)
            }
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 
            bg-slate-50 py-3 font-medium text-slate-700 transition-all duration-300 
            hover:-translate-y-0.5 hover:shadow-md hover:bg-slate-100"
          >
            <Printer className="h-5 w-5" />
            Print Admission Form
          </button>

          <button
            onClick={() => navigate(`/admin/students/${studentId}/pdf`)}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 
            bg-slate-50 py-3 font-medium text-slate-700 transition-all duration-300 
            hover:-translate-y-0.5 hover:shadow-md hover:bg-slate-100"
          >
            <Download className="h-5 w-5" />
            Download PDF
          </button>

          <button
            onClick={() => navigate("/admin/admissions")}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-600 py-3 
            font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 
            hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
          >
            <LayoutDashboard className="h-5 w-5" />
            Go to Admissions Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/admissions/new")}
            className="flex w-full items-center justify-center gap-2 pt-2 text-sm font-medium 
            text-emerald-600 transition hover:text-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Start New Admission
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
