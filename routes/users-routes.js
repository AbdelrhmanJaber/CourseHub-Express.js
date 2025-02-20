const express = require("express");
const validationSchemaFunc = require("../middleware/validationSchema");
const router = express.Router();
const userController = require("../controllers/users-controllers");
const verifyToken = require("../middleware/verify-token");

router.route("/").get(verifyToken, userController.getAllUsers);

router.route("/register").get(userController.register);

router.route("/login").get(userController.login);

module.exports = router;
