// import express from "express";
// import bodyParser from "body-parser";
// import adminRouter from "./routes/admin.js";
// import eventsRouter from "./routes/event.js";
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const adminRouter = require("./routes/admin");
const eventsRouter = require("./routes/event");
const loginRouter = require("./routes/login");
const path = require("path");
dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use the routes
app.use("/login", loginRouter);
app.use("/admin", adminRouter);
app.use("/events", eventsRouter);

// errors
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  res.status(status).json({ message: message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
