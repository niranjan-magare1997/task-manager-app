const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const router = express.Router();
const User = require("../models/users");
const auth = require("../middlewares/auth");
const mailer = require("../mailer/mailer");

router.post("/users", async (req, res) => {
  let user = new User(req.body);
  try {
    await user.save();
    mailer.sendWelcomEmail(user.email, user.name);
    const token = await user.generateJWTToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error });
  }
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
    mailer.sendGoodByEmail(req.user.email, req.user.name);
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

router.post(
  "/users/me/avatar",
  auth,
  avatars.single("avatars"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 100, height: 100 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user || !user.avatar) {
    throw new Error("Avatar not found.");
  }

  res.set("Content-Type", "image/png");
  res.send(user.avatar);
});

module.exports = router;
