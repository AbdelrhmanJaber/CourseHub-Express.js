require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const httpStatus = require("./utils/https_status_text");
const url = process.env.mongo_URL;
const cors = require("cors");

mongoose.connect(url).then(() => {
  console.log("Mongoose server is connected");
});

app.use(cors());

app.use(express.json());

const courseRouter = require("./routes/courses-routes");

app.use("/api/courses", courseRouter);

//global error handler for not found routes

app.all("*", (req, res, next) => {
  return res.status(404).json({
    status: httpStatus.ERROR,
    message: "This resourse is not available",
  });
});

//global error handler
app.use((error, req, res, next) => {
  res
    .status(error.statusCode)
    .json({
      status: error.statusText || httpStatus.ERROR,
      message: error.message,
    });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("listening on the port 5000");
});
