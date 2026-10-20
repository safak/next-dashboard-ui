"use client";

import { useRouter } from "next/navigation";
import { ReceiptText } from "lucide-react";
import { toast } from "react-toastify";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import FeeStructureForm from "./FeeStructureForm";
import { SelectOption } from "@/components/ui/form/FormSelect";
import { FeeStructureFormValues } from "@/lib/formValidationSchemas";

import { createFeeStructure, updateFeeStructure } from "@/lib/actions";

interface FeeStructureDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  classOptions: SelectOption[];

  mode: "create" | "edit";

  initialData?: FeeStructureFormValues;
}

export default function FeeStructureDrawer({
  open,
  onOpenChange,
  classOptions,
  mode,
  initialData,
}: FeeStructureDrawerProps) {
  const router = useRouter();

  const handleSubmit = async (values: FeeStructureFormValues) => {
    try {
      let result;

      if (mode === "create") {
        result = await createFeeStructure({ success: false }, values);
      } else {
        if (!initialData?.id) {
          toast.error("Fee structure ID is missing.");
          return;
        }

        result = await updateFeeStructure(
          { success: false },
          {
            ...values,
            id: initialData.id,
          },
        );
      }

      if (!result.success) {
        toast.error(result.error || "Failed to save fee structure.");
        return;
      }

      toast.success(
        mode === "create"
          ? "Fee structure created successfully."
          : "Fee structure updated successfully.",
      );

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Fee structure save error:", error);
      toast.error("Failed to save fee structure.");
    }
  };

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title={mode === "create" ? "Create Fee Structure" : "Edit Fee Structure"}
      description={
        mode === "create"
          ? "Create the annual fee structure for a class."
          : "Update the fee structure for this class."
      }
      width="md"
      icon={<ReceiptText className="h-6 w-6" />}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button type="submit" form="fee-structure-form">
            {mode === "create" ? "Create Fee Structure" : "Save Changes"}
          </Button>
        </>
      }
    >
      <FeeStructureForm
        mode={mode}
        classOptions={classOptions}
        initialData={initialData}
        onSubmit={handleSubmit}
      />
    </Drawer>
  );
}
