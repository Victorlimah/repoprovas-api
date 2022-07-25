import { TeacherDiscipline } from './../../node_modules/.prisma/client/index.d';
import { prisma } from "../data/db.js";

import { TestData } from "../services/testService.js";

export async function create(test: TestData) {
  const testCreated = await prisma.test.create({
    data: {
      ...test,
    },
  });
  return testCreated;
}

export async function findByTeacher(teacherDiscipline: TeacherDiscipline) {

  const discipline = await prisma.discipline.findFirst({
    where: {
      id: teacherDiscipline.disciplineId,
    },
    select: {
      name: true,
      term: {
        select: {
          number: true,
        },
      },
    },
  });

  const tests = await prisma.test.findMany({
    where: {
      teacherDisciplineId: teacherDiscipline.id,
    },
    select: {
      name: true,
      pdfUrl: true,
      categoryId: true,
    },
  });

  const testsWithCategory = await Promise.all(
    tests.map(async (test: any) => {
      const category = await prisma.category.findFirst({
        where: {
          id: test.categoryId,
        },
        select: {
          name: true,
        },
      });

      return {
        name: test.name,
        pdfUrl: test.pdfUrl,
        category: category.name,
      };
    })
  );

  return {
    term: discipline.term.number,
    name: discipline.name,
    tests: testsWithCategory,
  };
}

