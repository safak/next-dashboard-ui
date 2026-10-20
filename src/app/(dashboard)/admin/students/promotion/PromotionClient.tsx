"use client";

import { useCallback, useEffect, useState } from "react";

import PromotionFilters from "./components/PromotionFilters";
import PromotionStudentTable from "./components/PromotionStudentsTable";
import PromotionConfirmationCard from "./components/PromotionConfirmationCard";
import { toast } from "react-toastify";

interface AcademicYear {
  id: number;
  label: string;
  isActive: boolean;
}

interface Class {
  id: number;
  name: string;
}

interface Student {
  id: string;
  admissionNo: string;
  rollNo: number;
  name: string;
  surname: string;
  img: string | null;

  class: {
    id: number;
    name: string;
  };
}

interface Props {
  academicYears: AcademicYear[];
}

export default function PromotionClient({ academicYears }: Props) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [destinationClasses, setDestinationClasses] = useState<Class[]>([]);

  const [students, setStudents] = useState<Student[]>([]);

  const [currentAcademicYearId, setCurrentAcademicYearId] = useState<number>();

  const [nextAcademicYearId, setNextAcademicYearId] = useState<number>();

  const [classId, setClassId] = useState<number>();

  const [destinationClassId, setDestinationClassId] = useState<number>();

  // Student Selection
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  /* Load Classes */

  const fetchClasses = useCallback(
    async (
      academicYearId: number,
      setter: React.Dispatch<React.SetStateAction<Class[]>>,
    ) => {
      try {
        const response = await fetch(
          `/api/admin/promotions/classes?academicYearId=${academicYearId}`,
        );

        const result = await response.json();

        if (result.success) {
          setter(result.classes);
        } else {
          setter([]);
        }
      } catch (error) {
        console.error(error);
        setter([]);
      }
    },
    [],
  );

  /* Load Students */

  const fetchStudents = useCallback(async () => {
    if (!currentAcademicYearId || !classId) {
      setStudents([]);
      setSelectedStudents([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/promotions/students?academicYearId=${currentAcademicYearId}&classId=${classId}`,
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          `Failed to fetch students (${response.status})`,
          errorText,
        );

        setStudents([]);
        setSelectedStudents([]);
        return;
      }

      const result = await response.json();

      if (result.success) {
        setStudents(result.students ?? []);
        setSelectedStudents([]);
      } else {
        console.error(result.message);
        setStudents([]);
        setSelectedStudents([]);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);

      setStudents([]);
      setSelectedStudents([]);
    }
  }, [currentAcademicYearId, classId]);

  /* Toggle Student */

  const toggleStudent = useCallback((id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((studentId) => studentId !== id)
        : [...prev, id],
    );
  }, []);

  /* Toggle All Students */

  const toggleAllStudents = useCallback(() => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((student) => student.id));
    }
  }, [selectedStudents.length, students]);

  /* Current Academic Year Changed */

  useEffect(() => {
    if (!currentAcademicYearId) {
      setClasses([]);
      setClassId(undefined);
      setStudents([]);
      setSelectedStudents([]);
      return;
    }

    void fetchClasses(currentAcademicYearId, setClasses);

    setClassId(undefined);
    setStudents([]);
    setSelectedStudents([]);
  }, [currentAcademicYearId, fetchClasses]);

  /* Next Academic Year Changed */

  useEffect(() => {
    if (!nextAcademicYearId) {
      setDestinationClasses([]);
      setDestinationClassId(undefined);
      return;
    }

    void fetchClasses(nextAcademicYearId, setDestinationClasses);

    setDestinationClassId(undefined);
  }, [nextAcademicYearId, fetchClasses]);

  /* Current Class Changed */

  useEffect(() => {
    void fetchStudents();
  }, [fetchStudents]);

  const [promoting, setPromoting] = useState(false);

  const handlePromotion = async () => {
    if (!destinationClassId || !nextAcademicYearId) return;

    try {
      setPromoting(true);

      const response = await fetch("/api/admin/promotions/promote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentIds: selectedStudents,

          currentAcademicYearId,
          nextAcademicYearId,

          currentClassId: classId,
          destinationClassId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      toast.success(`${result.count} student(s) promoted successfully.`);

      setSelectedStudents([]);

      fetchStudents();
    } catch (error) {
      console.error(error);

      toast.error("Failed to promote students.");
    } finally {
      setPromoting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PromotionFilters
        academicYears={academicYears}
        classes={classes}
        destinationClasses={destinationClasses}
        currentAcademicYearId={currentAcademicYearId}
        nextAcademicYearId={nextAcademicYearId}
        classId={classId}
        destinationClassId={destinationClassId}
        onCurrentAcademicYearChange={setCurrentAcademicYearId}
        onNextAcademicYearChange={setNextAcademicYearId}
        onClassChange={setClassId}
        onDestinationClassChange={setDestinationClassId}
      />

      <PromotionStudentTable
        students={students}
        selectedStudents={selectedStudents}
        onToggleStudent={toggleStudent}
        onToggleAll={toggleAllStudents}
      />

      {selectedStudents.length > 0 &&
        destinationClassId &&
        nextAcademicYearId && (
          <PromotionConfirmationCard
            selectedCount={selectedStudents.length}
            currentAcademicYear={
              academicYears.find((y) => y.id === currentAcademicYearId)
                ?.label ?? "-"
            }
            nextAcademicYear={
              academicYears.find((y) => y.id === nextAcademicYearId)?.label ??
              "-"
            }
            currentClass={classes.find((c) => c.id === classId)?.name ?? "-"}
            destinationClass={
              destinationClasses.find((c) => c.id === destinationClassId)
                ?.name ?? "-"
            }
            loading={promoting}
            onPromote={handlePromotion}
          />
        )}
    </div>
  );
}
