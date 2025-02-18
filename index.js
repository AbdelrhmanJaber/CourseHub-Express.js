const express = require("express");
const app = express();
const mongoose = require("mongoose");
const url =
  "mongodb+srv://Abdelrahman2025:nodejs_1234@coursehub-mongodb.nv06z.mongodb.net/courseHub?retryWrites=true&w=majority&appName=courseHub-mongoDB";

mongoose.connect(url).then(() => {
  console.log("Mongoose server is connected");
});

app.use(express.json());

const courseRouter = require("./routes/courses-routes");

app.use("/api/courses", courseRouter);

app.listen(5000, () => {
  console.log("listening on the port 5000");
});
