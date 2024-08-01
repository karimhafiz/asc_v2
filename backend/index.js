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

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Use the routes
app.use("/login", loginRouter);
app.use("/admin", adminRouter);
app.use("/events", eventsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
