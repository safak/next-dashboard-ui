import "server-only";
import { LessonFormat } from "@prisma/client";
import prisma from "./prisma";
import { formatLabels, formatsFor } from "./subjectDelivery";

// Checks every chosen subject still exists and offers the chosen lesson
// type (its delivery mode may have changed since the form was loaded).
// Returns a message for the user, or null when all is well.
export const subjectChoicesProblem = async (
  choices: { subjectId: number; format: LessonFormat }[]
) => {
  const offered = await prisma.subject.findMany({
    where: { id: { in: choices.map((c) => c.subjectId) } },
    select: { id: true, name: true, delivery: true },
  });
  for (const choice of choices) {
    const subject = offered.find((s) => s.id === choice.subjectId);
    if (!subject) {
      return "One of the subjects is no longer offered. Reload the page and choose again.";
    }
    if (!formatsFor(subject.delivery).includes(choice.format)) {
      return `${subject.name} isn't offered as ${formatLabels[choice.format].toLowerCase()} lessons. Choose another lesson type.`;
    }
  }
  return null;
};
