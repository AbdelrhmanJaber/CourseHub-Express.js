const express = require("express");
const coursesController = require("../controllers/courses-controllers");
const validationSchemaFunc = require("../middleware/validationSchema");
const router = express.Router();

router
  .route("/")
  .get(coursesController.getAllCourses)
  .post(validationSchemaFunc(), coursesController.addCourse);

router
  .route("/:courseID")
  .get(coursesController.getCourse)
  .patch(validationSchemaFunc(), coursesController.updateCourse)
  .delete(coursesController.deleteCourse);

module.exports = router;
