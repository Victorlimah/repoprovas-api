import { Test } from '@prisma/client';

import * as testRepository from '../repositories/testRepository.js';
import * as categoriesRepository from '../repositories/categoriesRepository.js';
import * as teacherDisciplineRepository from "../repositories/teacherDisciplinesRepository.js";

export async function create(test: Test) {
  const category = await categoriesRepository.findById(test.categoryId);
  const discipline = await teacherDisciplineRepository.findById(test.teacherDisciplineId);

  if (!category || !discipline) 
    throw { type: "NotFound", message: "Category or Discipline not found" };

  const testCreated = await testRepository.create(test);
  return testCreated;
}
