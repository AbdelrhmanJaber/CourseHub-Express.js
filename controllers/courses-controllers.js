const { validationResult } = require("express-validator");
const Course = require("../models/courses-models");

const getAllCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

const getCourse = async (req, res) => {
  const course = await Course.findById(req.params.courseID);
  if (!course) {
    return res.status(404).json({ msg: "Course in  not found" });
  } else {
    res.json(course);
  }
};

const addCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.status(201).json(newCourse);
};

const updateCourse = (req, res) => {
  const courseID = +req.params.courseID;
  let course = courses.find((course) => course.id == +req.params.courseID);
  if (!course) {
    return res.status(404).json({ msg: "Course in  not found" });
  }
  course = { ...course, ...req.body };
  res.status(201).json(course);
};

const deleteCourse = (req, res) => {
  const courseID = +req.params.courseID;
  courses = courses.filter((course) => course.id != courseID);
  res.status(200).json(courses);
};

module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
