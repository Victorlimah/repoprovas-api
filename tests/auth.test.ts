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
    const user = userFactory.userFactory();
    const body = { ...user, confirmPassword: user.password };
    await supertest(app).post("/signup").send(body);

    const result = await supertest(app).post("/signin").send({ ...user });
    const status = result.status;
    expect(status).toEqual(200);
  });

  it("Login wrong credentials 401", async () => {
    const user = userFactory.adminFactory();

    const result = await supertest(app).post("/signin").send({ ...user, password: "wrongpass" });
    const status = result.status;
    console.error(result.body);
    expect(status).toEqual(401);
  });

});

describe("POST /test", () => {
  it("Create a new test 201", async () => {
    const user = userFactory.userFactory();
    const body = { ...user, confirmPassword: user.password };
    await supertest(app).post("/signup").send(body);

    const result = await supertest(app).post("/signin").send({ ...user });
    token = result.body.token;

    const test = await testFactory.testFactory(true);
    const resultTest = await supertest(app).post("/test").set("Authorization", `Bearer ${token}`).send(test);
    const status = resultTest.status;
    expect(status).toEqual(201);
  });

  it("Create a new test without send token 401", async () => {
    const body = await testFactory.testFactory();
    const response = await supertest(app)
      .post("/test")
      .send(body);

    const status = response.status;
    expect(status).toBe(401);
  });

  it("Create a new test with ids not found 404", async () => {
    const user = userFactory.adminFactory();
    const login = await supertest(app).post("/signin").send(user);

    const body = await testFactory.testFactory();
    const response = await supertest(app)
      .post("/test")
      .set("Authorization", `Bearer ${login.body.token}`)
      .send(body);

    const status = response.status;
    expect(status).toBe(404);
  });
});
