import {
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface ExamsSummaryProps {
  total: number;
  upcoming: number;
  completed: number;
  totalEvaluations: number;
}

export default function ExamsSummary({
  total,
  upcoming,
  completed,
  totalEvaluations,
}: ExamsSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <SummaryCard
        title="Total Exams"
        value={total}
        icon={ClipboardList}
        color="blue"
        compact
      />

      <SummaryCard
        title="Upcoming"
        value={upcoming}
        icon={CalendarClock}
        color="yellow"
        compact
      />

      <SummaryCard
        title="Completed"
        value={completed}
        icon={CheckCircle2}
        color="green"
        compact
      />

      <SummaryCard
        title="Evaluations"
        value={totalEvaluations}
        icon={BookOpenCheck}
        color="purple"
        compact
      />
    </div>
  );
}
