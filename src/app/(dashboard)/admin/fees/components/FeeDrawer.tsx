"use client";

import { IndianRupee } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import FeeForm from "./FeeForm";

import type { FeeWithRelations } from "../types";

interface FeeDrawerProps {
  open: boolean;

  /**
   * Existing fee plan / fee record when editing.
   * null when creating a new plan.
   */
  fee: FeeWithRelations | null;

  /**
   * Students available for fee assignment.
   */
  students: {
    id: string;
    name: string;
    surname: string;

    class: {
      id: number;
      name: string;
    } | null;
  }[];

  /**
   * Classes available for filtering students.
   */
  classes: {
    id: number;
    name: string;
  }[];

  /**
   * Academic years available for the fee plan.
   */
  academicYears: {
    id: number;
    label: string;
  }[];

  onClose: () => void;
}

export default function FeeDrawer({
  open,
  fee,
  students,
  classes,
  academicYears,
  onClose,
}: FeeDrawerProps) {
  const isEdit = Boolean(fee);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Fee Plan" : "Assign Fee"}
      description={
        isEdit
          ? "Update this student's annual fee plan and installment dates."
          : "Create an annual fee plan for a student."
      }
      width="lg"
      icon={<IndianRupee className="h-6 w-6" />}
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" form="fee-form">
            {isEdit ? "Save Changes" : "Create Fee Plan"}
          </Button>
        </div>
      }
    >
      <FeeForm
        mode={isEdit ? "edit" : "create"}
        fee={fee}
        students={students}
        classes={classes}
        academicYears={academicYears}
        onSuccess={onClose}
      />
    </Drawer>
  );
}
