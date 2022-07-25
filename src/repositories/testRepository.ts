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

  const teacher = await prisma.teacher.findFirst({
    where: {
      id: teacherDiscipline.teacherId,
    },
    select: {
      name: true,
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
    teacher: teacher.name,
    name: discipline.name,
    tests: testsWithCategory,
  };
}

export async function findByDiscpline(disciplineId: number) {
  const disciplines = await prisma.teacherDiscipline.findMany({
    where: {
      disciplineId,
    },
  });

  if (!disciplines)
    throw { type: "NotFound", message: "This discipline doesn't have classes" };

  const tests = await Promise.all(disciplines.map(async (teacherDiscipline: TeacherDiscipline) => {
    const discipline = await findByTeacher(teacherDiscipline);

    return {
      discipline,
    };
  }));

  const disciplinesWithTests = tests.filter((test) => {
    return test.discipline.tests.length > 0;
  })

  return disciplinesWithTests;
}