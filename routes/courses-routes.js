const express = require("express");
const coursesController = require("../controllers/courses-controllers");
const validationSchemaFunc = require("../middleware/validationSchema");
const router = express.Router();
const verifyToken = require("../middleware/verify-token");
const userRoles = require("../utils/user_roles");
const allowedTo = require("../middleware/allowedTo");

router
  .route("/")
  .get(coursesController.getAllCourses)
  .post(verifyToken, validationSchemaFunc(), coursesController.addCourse);

router
  .route("/:courseID")
  .get(coursesController.getCourse)
  .patch(validationSchemaFunc(), coursesController.updateCourse)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANAGER),
    coursesController.deleteCourse
  );

module.exports = router;
