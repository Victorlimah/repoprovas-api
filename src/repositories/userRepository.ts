import { prisma } from "../data/db.js";

import { userType } from "../services/userService.js";

export async function search(param: string, value: string | number) {
  return prisma.user.findFirst({
    where: {
      [param]: value,
    },
  });
}

export async function create(user: userType) {
  return prisma.user.create({
    data: {
      ...user,
    },
  });
}

