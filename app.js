const csurf = require("csurf");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const asyncHandler = require("express-async-handler");

const { environment } = require("./config");
const routes = require("./routes");
const { ValidationError } = require("sequelize");

const helmet = require("helmet");

const app = express();

app.use(morgan("dev"));

app.use(cookieParser());

app.use(express.json());

const isProduction = environment === "production";

if (!isProduction) {
  app.use(cors());
}

app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
    },
  })
);

app.use(routes);

app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found");
  err.title = "Resource not found";
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
});

app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    err.erros = err.errors.map((e) => e.message);
    err.title = "Validation Error";
  }
  next(err);
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || "Server Error",
    message: err.message,
    error: err.erros,
    stack: isProduction ? null : err.stack,
  });
});

module.exports = app;
