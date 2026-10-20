import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-96 items-center justify-center">
      <div className="flex items-center gap-3 text-slate-600">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading admission details...</span>
      </div>
    </div>
  );
}