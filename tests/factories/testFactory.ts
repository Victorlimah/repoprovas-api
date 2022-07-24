import { faker } from "@faker-js/faker";

export function cardFactory(categoryId: number = 99999, teacherDisciplineId: number = 999999) {
  const name = faker.lorem.words(3);
  const pdfUrl = faker.internet.url();

  return { name, pdfUrl, categoryId, teacherDisciplineId };
}
