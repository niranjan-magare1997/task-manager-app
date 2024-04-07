const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../../config/config");
const { connectDB } = require("../../src/db/mongoose");
const User = require("../../src/models/users");
const Task = require("../../src/models/tasks");
const task = require("../../src/models/tasks");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "dummyUser",
  email: "dummy@gmail.com",
  password: "dummy1!!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "dummySecondUser",
  email: "dummy.second@gmail.com",
  password: "dummy1!!",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "Testing Task One",
  completed: false,
  owner: userOneId,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Testing Task Two",
  completed: true,
  owner: userOneId,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Testing Task Three",
  completed: true,
  owner: userTwoId,
};

async function setupDB() {
  await connectDB();

  await User.deleteMany();
  await Task.deleteMany();

  await new User(userOne).save();
  await new User(userTwo).save();

  await new task(taskOne).save();
  await new task(taskTwo).save();
  await new task(taskThree).save();
}

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  setupDB,
  taskOne,
  taskTwo,
  taskThree,
};
