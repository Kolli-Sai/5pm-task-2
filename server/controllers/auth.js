const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(18),
});
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(18),
});

const registerUser = async (req, res) => {
  try {
    const { error } = await registerSchema.validateAsync(req.body);
    if (error) {
      return res.json({
        error: error.details[0].message,
      });
    }
    const { email, name, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.json({
        error: "email already exists!",
      });
    }

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    let newUser = {
      email,
      name,
      password: hashedPassword,
    };

    let createUser = await User.create(newUser);

    res.json(createUser);
  } catch (error) {
    res.json({ error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { error } = await loginSchema.validateAsync(req.body);
    if (error) {
      return res.json({
        error: error.details[0].message,
      });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "email not found!" });
    }
    let comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.json({
        error: "password incorrect!",
      });
    }
    let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
    });
  } catch (error) {
    res.json({ error });
  }
};

module.exports = { registerUser, loginUser };
