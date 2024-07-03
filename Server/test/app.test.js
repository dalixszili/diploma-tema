import supertest from "supertest";
import app from "../src/app";
const request = supertest(app);

var userID;
let cookie;

describe("/testNode endpoint", () => {
  it("should return a response ", async () => {
    const response = await request.get("/");
    expect(response.statusCode).toBe(200);
  });
});

describe("User POSTS", () => {
  it("/users with correct data", async () => {
    const response = await request.post("/users").send({
      name: "TestName1",
      email: "testemail@comgmail.com",
      password: "test-secret",
      confpassword: "test-secret",
    });

    expect(response.statusCode).toBe(201);
    userID = await response.body.id;
  });

  it("/user with existing email, error 400", async () => {
    const response = await request.post("/users").send({
      name: "TestName1",
      email: "testemail@comgmail.com",
      password: "test-secret",
      confpassword: "test-secret",
    });
    expect(response.statusCode).toBe(400);
  });

  it("/user with unmatched passwords, error 400", async () => {
    const response = await request.post("/users").send({
      name: "TestName1",
      email: "testemail@comgmail.com",
      password: "test-secret",
      confpassword: "test-secret-1",
    });
    expect(response.statusCode).toBe(400);
  });
});

describe("Authorization", () => {
  // try to get not logged in user
  it("GET /me, not logged in user, error 401", async () => {
    const response = await request.get("/me");
    expect(response.statusCode).toBe(401);
  });
  //try to login with wrong email
  it("POST /login, user not found, error 404", async () => {
    const response = await request.post("/login").send({
      email: "testemail1122@comgmail123456test.com123456",
    });
    expect(response.statusCode).toBe(404);
  });
  //try to login with wrong email
  it("POST /login, wrong password, error 400", async () => {
    const response = await request.post("/login").send({
      email: "testemail@comgmail.com",
      password: "test-secret-wrong",
    });
    expect(response.statusCode).toBe(400);
  });
  //login succesfully
  it("POST /login, succesfully, 200 ok", async () => {
    const response = await request.post("/login").send({
      email: "testemail@comgmail.com",
      password: "test-secret",
    });
    expect(response.statusCode).toBe(200);
    const cookies = response.headers["set-cookie"][0]
      .split(",")
      .map((item) => item.split(";")[0]);
    cookie = cookies.join(";");
  });
  // get logged in user data
  it("GET /me, 200 ok", async () => {
    const response = await request.get("/me").set("Cookie", cookie);
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(userID);
  });
});

describe("Cleanup", () => {
  // deleteUser
  it("/Patch /users/delete/:id, 200 ok ", async () => {
    const response = await request.patch(`/users/delete/${userID}`);
    expect(response.statusCode).toBe(200);
  });
});
