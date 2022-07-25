import { Test } from '@prisma/client';
import { TeacherDiscipline } from '@prisma/client';

import * as testRepository from '../repositories/testRepository.js';
import * as categoriesRepository from '../repositories/categoriesRepository.js';
import * as teacherDisciplineRepository from "../repositories/teacherDisciplinesRepository.js";

export type TestData = Omit<Test, "id" | "createdAt">;
export type TestWithDiscipline = Omit<TeacherDiscipline, "id" | "createdAt">;

export async function create(test: TestData) {
  const category = await categoriesRepository.findById(test.categoryId);

  if (!category)
    throw { type: "NotFound", message: "Category or Discipline not found" };

  const testCreated = await testRepository.create(test);
  return testCreated;
}

export async function getByTeacher(teacherId: number) {
  const disciplines = await teacherDisciplineRepository.findByTeacher(teacherId);

  if (!disciplines)
    throw { type: "NotFound", message: "This teacher doesn't have any discipline" };

  const tests = await Promise.all(disciplines.map(async (teacherDiscipline: TeacherDiscipline) => {
    const discipline = await testRepository.findByTeacher(teacherDiscipline);

    return {
      discipline,
    };
  }));

  const disciplinesWithTests = tests.filter((test) => {
    return test.discipline.tests.length > 0;
  })

  return disciplinesWithTests;
}

export async function getByDiscipline(disciplineId: number) {
  const discipline = await testRepository.findByDiscpline(disciplineId);

  return discipline;
}

async function getTeacherDispline(teacherId: number, disciplineId: number) {
  const teacherDiscipline = await teacherDisciplineRepository.findByTeacherAndDiscipline(teacherId, disciplineId);

  if (!teacherDiscipline) 
    throw { type: "NotFound", message: "This teacher doesn't have this discipline" };

  return teacherDiscipline;
}

export async function testFactory(test: {
  name: string;
  pdfUrl: string;
  categoryId: number;
  teacherId: number;
  disciplineId: number;
}): Promise<TestData> {
  const { name, pdfUrl, categoryId } = test;
  const teacherDiscipline = await getTeacherDispline(
    test.teacherId,
    test.disciplineId
  );

  return {
    name,
    pdfUrl,
    categoryId,
    teacherDisciplineId: teacherDiscipline.id,
  };
}

export async function getDisciplines() {
  const disciplines = await teacherDisciplineRepository.findDisciplines();

  return disciplines;
}

export async function getTeachers() {
  const teachers = await teacherDisciplineRepository.findTeachers();

  return teachers;
}