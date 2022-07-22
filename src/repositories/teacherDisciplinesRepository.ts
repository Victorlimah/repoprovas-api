import { prisma } from "../data/db.js";

export async function findById(id: number) {
  return prisma.teacherDiscipline.findFirst({
    where: {
      id,
    },
  });
}
