const request = require("supertest");

const app = require("../src/app");
const User = require("../src/models/users");
const { userOneId, userOne, setupDB } = require("./fixtures/db");

beforeEach(setupDB, 20 * 1000);

test("Should sign up a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "test_user",
      email: "test@domain.com",
      password: "test@123",
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: { name: "test_user", email: "test@domain.com" },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe("test@123");
});

test("Shoul login exsisting user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Shoul not login nonexsisting user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "something!!",
    })
    .expect(500);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should fail to get user profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete a user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should fail to delete a user for unauthorised user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload an avatar of user.", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatars", "test/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);

  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user field.", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: userOne.name + "_updated",
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe(userOne.name + "_updated");
});

test("Should fail to update unknown field for user", async () => {
  let res = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "LA",
    })
    .expect(400);

  expect(res.body).toEqual({
    error: "Please eneter valid fields to update.",
  });
});

test("Should fail to update unauthorized user", async () => {
  let res = await request(app)
    .patch("/users/me")
    .send({
      name: userOne.name + "_updated",
    })
    .expect(401);
});
