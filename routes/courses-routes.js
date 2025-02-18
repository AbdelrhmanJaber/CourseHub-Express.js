const express = require("express");
const { body, validationResult } = require("express-validator");
const coursesController = require("../controllers/courses-controllers");
const router = express.Router();

router
  .route("/")
  .get(coursesController.getAllCourses)
  .post(
    [
      body("title")
        .notEmpty()
        .withMessage("title is required")
        .isLength({ min: 2 })
        .withMessage("Title should be at least 2 digits"),
      body("price").notEmpty().withMessage("Price is required"),
    ],
    coursesController.addCourse
  );

router
  .route("/:courseID")
  .get(coursesController.getCourse)
  .patch(coursesController.updateCourse)
  .delete(coursesController.deleteCourse);

module.exports = router;
