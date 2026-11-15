// The enrolment agreement students sign when they register. Bump the version
// whenever the wording changes; each registration stores the version signed.
export const CONTRACT_VERSION = "2026-1";

export const getContractTerms = (schoolName: string) => [
  {
    title: "Attendance",
    body: `I will attend all lessons on time and give ${schoolName} a reason, in writing from my parent or guardian, for any absence.`,
  },
  {
    title: "Conduct",
    body: "I will treat students, teachers and staff with respect, follow the school's code of conduct, and accept the disciplinary measures that apply if I break it.",
  },
  {
    title: "Academic work",
    body: "I will complete assignments and exams honestly and by their due dates. Copying, cheating or submitting someone else's work as my own is not allowed.",
  },
  {
    title: "School property",
    body: "I will look after school buildings, books and equipment. Damage caused on purpose or through carelessness may have to be paid for.",
  },
  {
    title: "Fees",
    body: "My parent or guardian is responsible for paying any school fees on time, as set out in the school's fee schedule.",
  },
  {
    title: "Accurate information",
    body: "The information in this registration is true and complete. I will tell the school promptly if any of it changes, especially contact and medical details.",
  },
  {
    title: "Use of information",
    body: `${schoolName} may store and use the information in this registration to run my education, contact my guardians and keep me safe, and will not share it outside the school except where the law requires.`,
  },
];
