import { ReactNode } from "react";

interface FormActionsProps {
  children: ReactNode;
}

export default function FormActions({
  children,
}: FormActionsProps) {
  return (
    <div className="sticky bottom-0 mt-8 flex justify-end gap-3 border-t bg-white pt-6">
      {children}
    </div>
  );
}