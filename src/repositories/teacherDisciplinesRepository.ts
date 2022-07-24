import { prisma } from "../data/db.js";

export async function findByTeacherAndDiscipline(teacherId: number, disciplineId: number) {
  return prisma.teacherDiscipline.findFirst({
    where: {
      teacherId,
      disciplineId,
    },
  });
}
