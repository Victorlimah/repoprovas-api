import app from "../src/index.js";
import supertest from "supertest";

import { prisma } from "../src/data/db.js";
import * as userFactory from "./factories/userFactory.js";
import * as testFactory from "./factories/testFactory.js";

afterAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE users;`;
  await prisma.$executeRaw`TRUNCATE TABLE tests;`;
});

let token = null;
let user = null;

describe("POST /signup", () => {
  it("Create a account sucess 201", async () => {
    user = userFactory.userFactory();
    const body = { ...user, confirmPassword: user.password };
    const result = await supertest(app).post("/signup").send(body);
    const status = result.status;
    expect(status).toEqual(201);
  });

  it("Create a account already exists 409", async () => {
    const body = { ...userFactory.adminFactory(), confirmPassword: "admin123" };
    await supertest(app).post("/signup").send(body);
    const result = await supertest(app).post("/signup").send(body);
    const status = result.status;
    expect(status).toEqual(409);
  });
});

describe("POST /login", () => {
  it("Login sucess 200", async () => {
    user = userFactory.adminFactory();
    const result = await supertest(app).post("/signin").send(user);
    token = result.body.token;
    console.log(result.body)
    expect(result.status).toEqual(200);
  });

  it("Login wrong password 401", async () => {
    const register = userFactory.userFactory();
    await supertest(app).post("/signup").send(register);

    const login = { email: register.email, password: "wrongPassword" };
    const result2 = await supertest(app).post("/signin").send(login);

    const status = result2.status;
    expect(status).toEqual(401);
  });

  it("Login wrong email 401", async () => {
    const register = userFactory.userFactory();
    await supertest(app).post("/signup").send(register);

    const login = { password: register.password, email: "wrong@email.com" };
    const result2 = await supertest(app).post("/signin").send(login);

    const status = result2.status;
    expect(status).toEqual(401);
  });
});

describe("POST /test", () => {
  it("Create a new test 201", async () => {
    const body = testFactory.cardFactory(1,1);
    const value = token;
    const response = await supertest(app)
      .post("/test")
      .send(body)
      .set({ Authorization: `Bearer ${value}` });

    expect(response.status).toBe(201);
  });

  it("Create a new test without send token 401", async () => {
    const body = testFactory.cardFactory();
    const response = await supertest(app).post("/test").send(body);

    expect(response.status).toBe(401);
  });

  it("Create a new test with ids not found 404", async () => {
    const body = testFactory.cardFactory();
    const value = token;
    const response = await supertest(app)
      .post("/test")
      .send(body)
      .set({ "Authorization": `Bearer ${value}` });

    expect(response.status).toBe(404);
  });
});
