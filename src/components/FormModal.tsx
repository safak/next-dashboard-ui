"use client";

import {
  deleteAnnouncement,
  deleteAssignment,
  deleteAttendance,
  deleteClass,
  deleteExam,
  deleteLesson,
  deleteResult,
  deleteStudent,
  deleteSubject,
  deleteTeacher,
  deleteEvent,
  deleteParent,
  deleteFee,
  deleteHoliday,
} from "@/lib/actions";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useActionState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";
import ModalPortal from "./ModalPortal";
import { useSearchParams } from "next/navigation";
import ModalCloseButton from "@/components/ui/ModalCloseButton";

/* ------------------------------------------------------------------ */
/* TYPES */
/* ------------------------------------------------------------------ */

type TableKey = FormContainerProps["table"];

type ServerAction = (prev: any, formData: FormData) => Promise<any>;

const deleteActionMap: Partial<Record<TableKey, ServerAction>> = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  parent: deleteParent,
  exam: deleteExam,
  lesson: deleteLesson,
  assignment: deleteAssignment,
  result: deleteResult,
  attendance: deleteAttendance,
  event: deleteEvent,
  announcement: deleteAnnouncement,
  holiday: deleteHoliday,
  fee: deleteFee,
};

const iconMap: Record<string, string> = {
  create: "/createnew.png",
  update: "/update.png",
  delete: "/bin.png",
  assign: "/assignment.png",
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
  trigger,
}: FormContainerProps & { relatedData?: any; trigger?: ReactNode }) => {
  const router = useRouter();
  const params = useSearchParams();
  const action = params.get("action");
  const currentId = params.get("id");

  const isOpen =
    (type === "create" && action === "create") ||
    (type === "update" && action === "edit" && String(id) === currentId) ||
    (type === "delete" && action === "delete" && String(id) === currentId) ||
    (type === "assign" && action === "assign" && String(id) === currentId);

  const closeModal = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("action");
    params.delete("id");

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    router.replace(newUrl, { scroll: false });
  };

  const iconBase =
    "w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full transition hover:scale-105";

  const iconStyle =
    type === "create"
      ? "bg-purple-500 hover:bg-blue-600"
      : type === "update"
        ? "bg-black/50 hover:bg-blue-600"
        : type === "assign"
          ? "bg-yellow-300 hover:bg-blue-600"
          : "bg-red-400 hover:bg-blue-600";

  const Form = () => {
    /* 🚫 PROFILE CANNOT BE DELETED */
    if (type === "delete" && table === "profile") {
      return null;
    }

    /* DELETE */
    if (type === "delete" && id) {
      const action = deleteActionMap[table];
      if (!action) return null;

      return (
        <DeleteForm
          table={table}
          id={String(id)}
          action={action}
          onSuccess={() => {
            closeModal();
            router.refresh();
          }}
          onClose={closeModal} // ✅ ADD THIS
        />
      );
    }
    return null;
  };

  const openFromTrigger = () => {
    const currentParams = new URLSearchParams(params.toString());

    if (type === "create") {
      currentParams.set("action", "create");
    } else {
      if (!id) return;
      currentParams.set("action", type === "update" ? "edit" : type);
      currentParams.set("id", String(id));
    }

    router.push(`?${currentParams.toString()}`);
  };

  return (
    <>
      {/* TRIGGER (UNCHANGED) */}
      {(trigger === undefined || trigger) && (
        <div className="inline-flex items-center justify-center">
          {trigger === undefined ? (
            <button
              type="button"
              className={`${iconBase} ${iconStyle}`}
              onClick={openFromTrigger}
            >
              <Image src={iconMap[type]} alt={type} width={14} height={14} />
            </button>
          ) : (
            trigger
          )}
        </div>
      )}

      {isOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] bg-black/60 flex items-end sm:items-center justify-center">
            {/* MODAL CONTAINER */}
            <div className="relative w-full sm:max-w-xl md:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] flex flex-col p-4 sm:p-6">
              {/* MOBILE HANDLE */}
              <div className="sm:hidden flex justify-center mb-2">
                <div className="w-10 h-1.5 rounded-full bg-gray-300" />
              </div>
              <Form />
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
};

export default FormModal;

function DeleteForm({
  table,
  id,
  action,
  onSuccess,
  onClose,
}: {
  table: TableKey;
  id: string;
  action: ServerAction;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [state, formAction] = useActionState(action, {
    success: false,
    error: false,
  });

  useEffect(() => {
    if (state.success) {
      toast.success(`${table} deleted successfully`);
      onSuccess();
    }
  }, [state.success, table, onSuccess]);

  return (
    <form action={formAction} className="relative flex flex-col gap-6">
      {/* ✅ CLOSE BUTTON */}
      <div className="absolute right-0 top-0">
        <ModalCloseButton onClose={onClose} />
      </div>

      <h2 className="text-lg font-semibold text-center">Delete {table}?</h2>

      <p className="text-sm text-center text-gray-600">
        This {table} will be deleted permanently.
        <br />
        <span className="text-red-600 font-medium">
          This action cannot be undone.
        </span>
      </p>

      <input type="hidden" name="id" value={id} />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 h-10 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="flex-1 h-10 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete
        </button>
      </div>

      {state.error && (
        <p className="text-xs text-red-500 text-center">{state.error}</p>
      )}
    </form>
  );
}
