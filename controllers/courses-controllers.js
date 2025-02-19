const { validationResult } = require("express-validator");
const Course = require("../models/courses-models");
const httpStatus = require("../utils/https_status_text");
const asynchWrapper = require("../middleware/asynchWrapper");
const appError = require("../utils/appError");

const getAllCourses = asynchWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({ status: httpStatus.SUCCESS, data: { courses } });
});

const getCourse = asynchWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseID);
  if (!course) {
    const error = appError.create("Course is not found", 404, httpStatus.ERROR);
    return next(error);
  } else {
    res.json(course);
  }
});

const addCourse = asynchWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatus.FAIL);
    return next(error);
  }
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.status(201).json({ status: httpStatus.SUCCESS, data: { newCourse } });
});

const updateCourse = asynchWrapper(async (req, res, next) => {
  const courseId = req.params.courseID;
  const updatedCourse = await Course.findOneAndUpdate(
    { _id: courseId },
    {
      $set: { ...req.body },
    }
  );
  if (!updateCourse) {
    const error = appError.create("Course is not found", 404, httpStatus.ERROR);
    return next(error);
  }
  return res
    .status(200)
    .json({ status: httpStatus.SUCCESS, data: { updatedCourse } });
});

const deleteCourse = asynchWrapper(async (req, res, next) => {
  const data = await Course.findOneAndDelete({ _id: req.params.courseID });
  if (!data) {
    const error = appError.create("Course is not found", 404, httpStatus.ERROR);
    return next(error);
  }
  res.status(200).json({ status: httpStatus.SUCCESS, data: null });
});

module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
