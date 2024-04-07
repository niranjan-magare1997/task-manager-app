const express = require("express");
const router = express.Router();
const Task = require("../models/tasks");
const auth = require("../middlewares/auth");

router.post("/tasks", auth, async (req, res) => {
  // let user = new Task(req.body)
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }

  // user.save().then(() => {
  //     console.log("Task inserted succesfully")
  //     res.status(200).send({ body: "Task inserted succesfully" })
  // }).catch((err) => {
  //     res.status(400).send({ error: err })
  // })
});

// Get /tasks/?sortBy=createdAt:asc OR /tasks/?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
  try {
    let match = {},
      options = {};

    if (req.query.completed) {
      match.completed = req.query.completed === "true" ? true : false;
    }

    if (req.query.limit) {
      options.limit = parseInt(req.query.limit);
    }

    if (req.query.skip) {
      options.skip = parseInt(req.query.skip);
    }

    if (req.query.sortBy) {
      let splitVal = req.query.sortBy.split(":");
      options.sort = { [splitVal[0]]: splitVal[1] === "desc" ? -1 : 1 };
    }

    await req.user.populate({
      path: "tasks",
      match,
      options,
    });

    // const tasks = await Task.find({
    //     owner: req.user._id
    // })

    res.status(200).send(req.user.tasks);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }

  // Task.find({}).then((tasks) => {
  //     res.status(200).send(tasks)
  // }).catch((error) => {
  //     res.status(500).send({ error: err })
  // })
});

router.get("/tasks/:id", auth, async (req, res) => {
  const id = req.params.id;

  try {
    // const task = await Task.findById(id)
    const task = await Task.findOne({ _id: id, owner: req.user._id });

    console.log("Tasks is ==> ", task);

    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }

  // Task.findById(_id).then((task) => {
  //     if (!task) {
  //         return res.status(404).send()
  //     }
  //     res.status(200).send(task)
  // }).catch((error) => {
  //     res.status(500).send({ error: error })
  // })
});

router.patch("/tasks/:id", auth, async (req, res) => {
  try {
    const allowedFields = ["description", "completed"];
    const incomingFields = Object.keys(req.body);

    const areValidFields = incomingFields.every((eachField) =>
      allowedFields.includes(eachField)
    );

    if (!areValidFields) {
      return res.send({
        error: "Please enter valied fields to update.",
      });
    }

    const id = req.params.id;
    // const updateData = req.body
    // const task = await Task.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
    console.log(`=====> id = ${id} user id => ${req.user._id}`);
    const task = await Task.findOne({ _id: id, owner: req.user._id });
    // const task = await Task.findById(id)
    incomingFields.forEach(
      (eachField) => (task[eachField] = req.body[eachField])
    );
    await task.save();

    if (!task) return res.status(400).send();
    res.send(task);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    // const task = await Task.findByIdAndDelete(id)
    const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!task) return res.status(404).send();

    res.send(task);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

module.exports = router;
