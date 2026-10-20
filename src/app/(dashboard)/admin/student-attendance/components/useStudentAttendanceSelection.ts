"use client";

import { useCallback, useMemo, useState } from "react";

interface SelectableStudent {
  id: string;
}

export default function useStudentAttendanceSelection(
  students: SelectableStudent[],
) {
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(
    new Set(),
  );

  /*
   * Select / unselect one student
   */
  const handleStudentSelect = useCallback(
    (studentId: string, checked: boolean) => {
      setSelectedStudentIds((current) => {
        const next = new Set(current);

        if (checked) {
          next.add(studentId);
        } else {
          next.delete(studentId);
        }

        return next;
      });
    },
    [],
  );

  /*
   * Select / unselect all students
   */
  const handleSelectAllStudents = useCallback(
    (checked: boolean) => {
      if (!checked) {
        setSelectedStudentIds(new Set());
        return;
      }

      setSelectedStudentIds(
        new Set(students.map((student) => student.id)),
      );
    },
    [students],
  );

  /*
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    setSelectedStudentIds(new Set());
  }, []);

  /*
   * Whether every student is selected
   */
  const allStudentsSelected = useMemo(() => {
    return (
      students.length > 0 &&
      selectedStudentIds.size === students.length
    );
  }, [students.length, selectedStudentIds.size]);

  /*
   * Whether some but not all students are selected
   */
  const someStudentsSelected = useMemo(() => {
    return (
      selectedStudentIds.size > 0 &&
      selectedStudentIds.size < students.length
    );
  }, [students.length, selectedStudentIds.size]);

  return {
    selectedStudentIds,
    selectedCount: selectedStudentIds.size,

    allStudentsSelected,
    someStudentsSelected,

    handleStudentSelect,
    handleSelectAllStudents,
    clearSelection,
  };
}