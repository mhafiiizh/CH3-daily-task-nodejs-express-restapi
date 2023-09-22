//  CORE PACKAGE MODULE
const http = require("http");
const fs = require("fs");

// THIRD PARTY MODULE
const express = require("express");
const morgan = require("morgan");

// LOCAL MODULE
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// Middleware express
// Memodifikasi
app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
