const asynchWrapper = require("../middleware/asynchWrapper");
const User = require("../models/users-models");
const httpStatus = require("../utils/https_status_text");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const generate_JWT = require("../utils/generate_jwt");
const userRoles = require("../utils/user_roles");
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
    if (!Object.values(userRoles).includes(newUser.role)) {
      return next(appError.create("Not a valid role", 400, httpStatus.ERROR));
    }
    newUser.password = await bcrypt.hash(newUser.password, 10);
    // generate JWT Token
    const token = await generate_JWT({
      email: newUser.email,
      id: newUser._id,
      role: newUser.role,
    });
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
      const token = await generate_JWT({
        email: user.email,
        id: user._id,
        role: user.role,
      });
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

const deleteUser = asynchWrapper(async (req, res, next) => {
  const data = await User.findOneAndDelete({ _id: req.params.userID });
  if (!data) {
    const error = appError.create("User is not found", 404, httpStatus.ERROR);
    return next(error);
  }
  res.status(200).json({ status: httpStatus.SUCCESS, data: null });
});

module.exports = {
  getAllUsers,
  register,
  login,
  deleteUser,
};
