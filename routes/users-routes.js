const express = require("express");
const router = express.Router();
const userController = require("../controllers/users-controllers");
const verifyToken = require("../middleware/verify-token");
const userRoles = require("../utils/user_roles");
const allowedTo = require("../middleware/allowedTo");

router.route("/").get(userController.getAllUsers);

router.route("/register").post(userController.register);

router.route("/login").post(userController.login);

router
  .route("/:userID")
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANAGER),
    userController.deleteUser
  );

module.exports = router;
