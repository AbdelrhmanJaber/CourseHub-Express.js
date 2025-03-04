const jwt = require("jsonwebtoken");
const httpStatus = require("../utils/https_status_text");
const appError = require("../utils/appError");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];
  if (!authHeader) {
    const error = appError.create("Token is required", 401, httpStatus.ERROR);
    return next(error);
  }
  const token = authHeader.split(" ")[1];
  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    const error = appError.create("invalid token", 401, httpStatus.ERROR);
    return next(error);
  }
};

module.exports = verifyToken;
