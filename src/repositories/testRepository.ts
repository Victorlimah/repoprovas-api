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

