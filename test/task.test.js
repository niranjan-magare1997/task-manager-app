const request = require("supertest");

const app = require("../src/app");
const Task = require("../src/models/tasks");
const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  setupDB,
  taskOne,
  taskTwo,
  taskThree,
} = require("./fixtures/db");

beforeEach(setupDB, 20 * 1000);

test("Should create a task", async () => {
  const res = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "Adding task from test script.",
    })
    .expect(201);
  console.log("Task is => ", res.body);

  const task = await Task.findById(res.body._id);
  expect(task).not.toBeNull();
});

test("Should get userOne tasks only", async () => {
  const response = await request(app)
    .get(`/tasks`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  console.log("Get tasks by id of userOne => ", response.body);
  expect(response.body).toHaveLength(2);
});

test("Should not be able to delete task added by first user.", async () => {
  let response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task1 = await Task.findById(taskOne._id);
  expect(task1).not.toBeNull();

  const task2 = await Task.findById(taskTwo._id);
  expect(task2).not.toBeNull();
});
