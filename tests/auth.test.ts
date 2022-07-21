import app from "../src/index.js";
import supertest from "supertest";

import { prisma } from "../src/data/db.js";
import * as userFactory from "./factories/userFactory.js";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE users;`;
});

describe("POST /signup", () => {
  it("Create a account sucess 201", async () => {
    const body = userFactory.userFactory();
    const result = await supertest(app).post("/signup").send(body);
    const status = result.status;
    expect(status).toEqual(201);
  });

  it("Create a account already exists 409", async () => {
    const body = {...userFactory.adminFactory(), confirmPassword: "admin123"};
    await supertest(app).post("/signup").send(body);
    const result = await supertest(app).post("/signup").send(body);
    const status = result.status;
    expect(status).toEqual(409);
  } );
});

describe ("POST /login", () => {
  it("Login sucess 200", async () => {
    const body = userFactory.adminFactory();
    const result = await supertest(app).post("/signin").send(body);
    const token = result.body.token;
    expect(token).not.toBeNull();
  } );

  it("Login wrong password 401", async () => {
    const register = userFactory.userFactory();
    await supertest(app).post("/signup").send(register);

    const login = { email: register.email, password: "wrongPassword" };
    const result2 = await supertest(app).post("/signin").send(login);

    const status = result2.status;
    expect(status).toEqual(401);
  } );

  it("Login wrong email 401", async () => {
    const register = userFactory.userFactory();
    await supertest(app).post("/signup").send(register);

    const login = { password: register.password, email: "wrong@email.com" };
    const result2 = await supertest(app).post("/signin").send(login);

    const status = result2.status;
    expect(status).toEqual(401);
  } );
});
