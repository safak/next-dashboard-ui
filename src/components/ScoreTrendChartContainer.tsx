import prisma from "@/lib/prisma";
import ScoreTrendChart, { ScorePoint } from "./ScoreTrendChart";

const MONTHS_SHOWN = 12;

// Average exam and assignment scores per month, dated by when the
// exam / assignment started
const ScoreTrendChartContainer = async () => {
  const results = await prisma.result.findMany({
    select: {
      score: true,
      exam: { select: { startTime: true } },
      assignment: { select: { startDate: true } },
    },
  });

  const buckets = new Map<
    string,
    { date: Date; exams: number[]; assignments: number[] }
  >();
  for (const r of results) {
    const date = r.exam?.startTime ?? r.assignment?.startDate;
    if (!date) continue;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const bucket = buckets.get(key) ?? {
      date: new Date(date.getFullYear(), date.getMonth(), 1),
      exams: [],
      assignments: [],
    };
    (r.exam ? bucket.exams : bucket.assignments).push(r.score);
    buckets.set(key, bucket);
  }

  const avg = (xs: number[]) =>
    xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null;

  const data: ScorePoint[] = [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-MONTHS_SHOWN)
    .map(([, b]) => ({
      month: b.date.toLocaleString("en-US", { month: "short", year: "2-digit" }),
      exams: avg(b.exams),
      assignments: avg(b.assignments),
    }));

  return (
    <div className="card w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Average Scores</h1>
        <span className="text-xs text-gray-400">out of 100, by month</span>
      </div>
      <ScoreTrendChart data={data} />
    </div>
  );
};

export default ScoreTrendChartContainer;
