import app from "../src/index.js";
import supertest from "supertest";

//TODO: criar testes dos efeitos colaterais
//TODO: criar testes de integração dos gets em /test

import { prisma } from "../src/data/db.js";
import * as userFactory from "./factories/userFactory.js";
import * as testFactory from "./factories/testFactory.js";

afterAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE users;`;
  await prisma.$executeRaw`TRUNCATE TABLE tests;`;
});

describe("POST /signup", () => {
  it("Create a account sucess 201", async () => {
    const user = userFactory.userFactory();

    const body = { ...user, confirmPassword: user.password };
    const result = await supertest(app).post("/signup").send(body);
    
    expect(result.status).toBe(201);

    const checkUser = prisma.$executeRaw`SELECT * FROM users WHERE email = '${user.email}'`;
    expect(checkUser).toBeTruthy();
  });

  it("Create a account already exists 409", async () => {
    const body = { ...userFactory.adminFactory(), confirmPassword: "admin123" };

    await supertest(app).post("/signup").send(body);
    const result = await supertest(app).post("/signup").send(body);

    const status = result.status;
    expect(status).toBe(409);
  });
});

describe("POST /signin", () => {
  it("Login sucess 200", async () => {
    const user = userFactory.userFactory();
    const body = { ...user, confirmPassword: user.password };

    await supertest(app).post("/signup").send(body);
    const result = await supertest(app).post("/signin").send({ ...user });

    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty("token");
  });

  it("Login wrong credentials 401", async () => {
    const user = userFactory.adminFactory();
    const result = await supertest(app).post("/signin").send({ ...user, password: "wrongpass" });

    const status = result.status;
    expect(status).toBe(401);
  });

});

describe("POST /test", () => {
  it("Create a new test 201", async () => {
    const user = userFactory.userFactory();
    const body = { ...user, confirmPassword: user.password };
    await supertest(app).post("/signup").send(body);

    const result = await supertest(app).post("/signin").send({ ...user });
    const token = result.body.token;

    const test = await testFactory.testFactory(true);
    const resultTest = await supertest(app).post("/test").set("Authorization", `Bearer ${token}`).send(test);
    expect(resultTest.status).toBe(201);

    const checkTest = prisma.$executeRaw`SELECT * FROM tests WHERE id = '${resultTest.body.id}'`;
    expect(checkTest).toBeTruthy();
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

describe("GET /test", () => {
  it("Get teacher's tests", async () => {
    const user = userFactory.adminFactory();
    const login = await supertest(app).post("/signin").send(user);

    const test = await testFactory.testFactory(true);
    const insertTest = await supertest(app).post("/test").set("Authorization", `Bearer ${login.body.token}`).send(test);
    expect(insertTest.status).toBe(201);

    const teacher = await testFactory.getTeacher();

    const response = await supertest(app).get(`/test/teacher/${teacher.id}`).set("Authorization", `Bearer ${login.body.token}`);
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("discipline");
  });

  it("Get discipline's tests", async () => {
    const user = userFactory.adminFactory();
    const login = await supertest(app).post("/signin").send(user);

    const test = await testFactory.testFactory(true);
    const insertTest = await supertest(app).post("/test").set("Authorization", `Bearer ${login.body.token}`).send(test);
    expect(insertTest.status).toBe(201);

    const discipline = await testFactory.getDiscipline();

    const response = await supertest(app).get(`/test/discipline/${discipline.id}`).set("Authorization", `Bearer ${login.body.token}`);
    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("discipline");
  });
});