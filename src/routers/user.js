const express = require("express");
const multer = require("multer");
const router = express.Router();
const User = require("../models/users");
const auth = require("../middlewares/auth");

router.post("/users", async (req, res) => {
  console.log(req.body);
  let user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateJWTToken();
    console.log("token is ", token);
    res.status(201).send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error });
  }

  // u.save().then((response) => {
  //     console.log("Inserted succesfully ", response)
  //     res.send({ response: "Inserted succesfully" })
  // }).catch((err) => {
  //     console.log(err)
  //     res.status(400).send({ error: err })
  // })
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateJWTToken();
    res.send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.user.save();
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  try {
    res.send(req.user);
    // const users = await User.find({})
    // res.status(200).send(users)
  } catch (error) {
    res.status(500).send(error);
  }

  // User.find({}).then((data) => {
  //     res.status(200).send(data)
  // }).catch((error) => {
  //     res.status(500).send({
  //         error: error
  //     })
  // })
});

router.patch("/users/me", auth, async (req, res) => {
  const allowedFields = ["name", "email", "password", "age"];
  const incomingFields = Object.keys(req.body);
  const allExists = incomingFields.every((eachField) =>
    allowedFields.includes(eachField)
  );

  if (!allExists) {
    return res.status(400).send({
      error: "Please eneter valid fields to update.",
    });
  }

  try {
    const id = req.params.id;
    // const updateData = req.body
    // const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true})

    const user = req.user;

    incomingFields.forEach(
      (eachField) => (user[eachField] = req.body[eachField])
    );

    await req.user.save();

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id)
    // if (!user) return res.status(404).send()
    // res.send(user)
    await req.user.deleteOne({
      id: req.user._id,
    });
    // await req.user.remove()
    res.send(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

const avatars = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("File format not supported !"));
    }

    cb(undefined, true);
  },
});

router.post("/user/me/avatar", auth, avatars.single("avatars"), async (req, res) => {
    req.user.avatar = req.file.buffer;
    console.log("req.user ==> ", req.user);
    let res2 = await req.user.save();
    console.log("Res => ", res2);

    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
