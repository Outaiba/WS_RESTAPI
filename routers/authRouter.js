const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
authRouter.post("/register", async (req, res) => {
  try {
    // get user inputs
    const { name, email, password } = req.body;

    // validate user inputs
    if (!(name && email && password)) {
      res.status(400).send("field must not be empty");
    }

    // check if user is exist
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      res.status(409).send("user alredy exist please just login");
    }

    // emcryptedPassword
    const encryptedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: encryptedPassword,
    });
    const token = jwt.sign(
      {
        user_id: user._id,
        email,
      },
      process.env.SECRET,
      { expiresIn: "2h" }
    );
    user.token = token;
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("inputs must be fielled");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
        },
        process.env.SECRET,
        { expiresIn: "2h" }
      );
      user.token = token;
      res.status(200).json(user);
    }
    res.status(403).send("bad credential");
  } catch (error) {
    console.log(error);
  }
});
module.exports = authRouter;
