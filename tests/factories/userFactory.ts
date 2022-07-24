import { faker } from "@faker-js/faker";

export function userFactory() {
  const email = faker.internet.email();
  const password = faker.internet.password();

  return {
    email,
    password,
  };
}

export function adminFactory() {
  const email = "admin@admin.com"
  const password = "admin123"

  return {
    email,
    password,
  };
}