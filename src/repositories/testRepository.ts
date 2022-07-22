import { Test } from "@prisma/client";
import { prisma } from "../data/db.js";

export async function create(test: Test) {
  const testCreated = await prisma.test.create({
    data: {
      ...test,
    },
  });
  return testCreated;
}

