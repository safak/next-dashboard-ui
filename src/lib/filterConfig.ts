export const filterConfig = {
  subjectId: {
    label: "Subject",
    resolve: (value: string, ctx: any) =>
      ctx.subjects?.find((s: any) => String(s.id) === value)?.name,
  },

  classId: {
    label: "Class",
    resolve: (value: string, ctx: any) =>
      ctx.classes?.find((c: any) => String(c.id) === value)?.name,
  },

  teacherId: {
    label: "Teacher",
    resolve: (value: string, ctx: any) => {
      const t = ctx.teachers?.find((t: any) => t.id === value);
      return t ? `${t.name} ${t.surname}` : null;
    },
  },

  supervisorId: {
    label: "Supervisor",
    resolve: (value: string, ctx: any) => {
      const t = ctx.teachers?.find((t: any) => t.id === value);
      return t ? `${t.name} ${t.surname}` : null;
    },
  },

  search: {
    label: "Search",
    resolve: (value: string) => value,
  },
};