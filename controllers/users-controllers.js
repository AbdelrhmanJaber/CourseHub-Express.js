const asynchWrapper = require("../middleware/asynchWrapper");
const User = require("../models/users-models");
const httpStatus = require("../utils/https_status_text");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generate_JWT = require("../utils/generate_jwt");
require("dotenv").config();

const getAllUsers = asynchWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const users = await User.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({ status: httpStatus.SUCCESS, data: { users } });
});

const register = asynchWrapper(async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    // generate JWT Token
    const token = await generate_JWT({ email: newUser.email, id: newUser._id });
    newUser.token = token;
    await newUser.save();
    res.status(201).json({ status: httpStatus.SUCCESS, data: { newUser } });
  } catch (err) {
    if (err.name === "ValidationError") {
      const error = appError.create(
        "failed must be a valid email address",
        400,
        httpStatus.ERROR
      );
      return next(error);
    }
    if (err.code === 11000) {
      const error = appError.create(
        "This Email is already exist",
        400,
        httpStatus.ERROR
      );
      return next(error);
    }
  }
});

const login = asynchWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    const error = appError.create(
      "E-mail and Password are required",
      400,
      httpStatus.ERROR
    );
    return next(error);
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = appError.create("User is not found", 404, httpStatus.FAIL);
    return next(error);
  } else {
    const matchedPassword = await bcrypt.compare(password, user.password);
    if (matchedPassword) {
      const token = await generate_JWT({ email: user.email, id: user._id });
      res.json({
        status: httpStatus.SUCCESS,
        data: { token },
      });
    } else {
      const error = appError.create("Wrong Password", 400, httpStatus.ERROR);
      return next(error);
    }
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};
