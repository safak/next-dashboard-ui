export function generateTeacherInsights({
  attendanceRate,
  studentStats,
  pendingAssignments,
}: any) {
  const insights: any[] = [];

  // 🔴 LOW ATTENDANCE (CLASS LEVEL)
  if (attendanceRate < 50) {
    insights.push({
      type: "critical",
      message: "Very low class attendance today",
      value: `${attendanceRate}%`,
    });
  }

  // 🟡 MODERATE ATTENDANCE
  if (attendanceRate >= 50 && attendanceRate < 75) {
    insights.push({
      type: "warning",
      message: "Attendance needs improvement",
      value: `${attendanceRate}%`,
    });
  }

  // 🔴 STUDENTS AT RISK
  const lowStudents = studentStats.filter((s: any) => s.percentage < 50);

  if (lowStudents.length > 0) {
    insights.push({
      type: "critical",
      message: "Students at risk (low attendance)",
      value: lowStudents.length,
    });
  }

  // 🟡 TOP PERFORMER
  const topStudent = [...studentStats].sort(
    (a, b) => b.percentage - a.percentage
  )[0];

  if (topStudent && topStudent.percentage >= 90) {
    insights.push({
      type: "good",
      message: `Top performer: ${topStudent.name}`,
      value: `${topStudent.percentage}%`,
    });
  }

  // 🟡 ASSIGNMENT ALERT
  if (pendingAssignments > 0) {
    insights.push({
      type: "warning",
      message: "Pending assignments need review",
      value: pendingAssignments,
    });
  }

  // 🟢 ALL GOOD
  if (insights.length === 0) {
    insights.push({
      type: "good",
      message: "All systems running smoothly",
    });
  }

  return insights;
}