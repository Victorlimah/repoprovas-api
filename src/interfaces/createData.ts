import {
  Category,
  Discipline,
  Teacher,
  TeacherDiscipline,
  Term,
  Test,
  User,
} from "@prisma/client";

export type CreateUser = Omit<User, "id" | "createdAt">;
export type CreateCategory = Omit<Category, "id" | "createdAt">;
export type CreateTest = Omit<Test, "id" | "createdAt">;
export type CreateTeacher = Omit<Teacher, "id" | "createdAt">;
export type CreateDiscipline = Omit<Discipline, "id" | "createdAt">;
export type CreateTeacherDiscipline = Omit<TeacherDiscipline, "id" | "createdAt">;
export type CreateTerm = Omit<Term, "id" | "createdAt">;
