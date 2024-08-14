// import express from "express";
const express = require("express");
// import {
//   getAllEvents,
//   getEventById,
//   createEvent,
//   updateEvent,
//   deleteEvent,
// } from "../queries/eventsQueries";

const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../queries/eventsQueries");
const eventsRouter = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer();

// Get all events
eventsRouter.get("/", async (req, res) => {
  try {
    const result = await getAllEvents();
    res.json(result);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).send("Server error");
  }
});

// Get a single event by ID
eventsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getEventById(id);
    if (result.length === 0 || !result) {
      return res.status(404).send("Event not found");
    }
    res.json(result);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).send("Server error");
  }
});

// Create a new event

eventsRouter.post("/", upload.single("image"), async (req, res) => {
  let eventData;

  try {
    // Parse eventData from the 'event-data' field in the form-data
    if (typeof req.body["event-data"] === "string") {
      eventData = JSON.parse(req.body["event-data"]);
    } else if (typeof req.body["event-data"] !== "string") {
      eventData = JSON.parse(req.body.eventData);
    } else {
      throw new Error("event-data is not a string");
    }
  } catch (error) {
    console.error("Error parsing eventData:", error);
    return res.status(400).send("Invalid event data");
  }

  const {
    title,
    shortdescription,
    longdescription,
    date,
    openingtime,
    street,
    postcode,
    city,
    agerestriction,
    accessibilityinfo,
    ticketprice,
    createdby,
    image,
  } = eventData;

  // Handle the image data if provided
  let imageBuffer;
  if (req.file) {
    imageBuffer = req.file.buffer;
  } else if (image && image.startsWith("data:image/")) {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    imageBuffer = Buffer.from(base64Data, "base64");
  }

  try {
    // Create a new event
    const result = await createEvent({
      title,
      shortdescription,
      longdescription,
      date,
      openingtime,
      street,
      postcode,
      city,
      agerestriction,
      accessibilityinfo,
      image: imageBuffer || "", // Include image binary data if provided
      ticketprice,
      createdby: createdby || 17, // Default createdby if not provided
    });

    res
      .status(201)
      .json({ message: "Event created successfully", result: result.rows[0] });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).send("Server error");
  }
});

// Update an event by ID
// eventsRouter.patch("/:id", async (req, res) => {
//   const { id } = req.params;
//   const {
//     title,
//     shortdescription,
//     longdescription,
//     date,
//     openingtime,
//     street,
//     postcode,
//     city,
//     agerestriction,
//     accessibilityinfo,
//     image,
//     ticketprice,
//     createdby,
//   } = req.body;

//   console.log("heyy" + JSON.parse(req.body.eventData));

//   // let imageBuffer = null;
//   // if (image && image.startsWith("data:image")) {
//   //   const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
//   //   imageBuffer = Buffer.from(base64Data, "base64");
//   //   // Save image to file system or database if needed
//   //   // fs.writeFileSync(path.join(__dirname, 'uploads', 'image.png'), imageBuffer);
//   // }

//   try {
//     const result = await updateEvent(id, {
//       title,
//       shortdescription,
//       longdescription,
//       date,
//       openingtime,
//       street,
//       postcode,
//       city,
//       image,
//       agerestriction,
//       accessibilityinfo,
//       image, // or image as a file path if saved to file system
//       ticketprice,
//       createdby,
//     });
//     if (result.length === 0 || !result) {
//       return res.status(404).send("Event not found");
//     }
//     res.status(200).json(result);
//   } catch (err) {
//     console.error("Error updating event:", err);
//     res.status(500).send("Server error");
//   }
// });
// upload.single("image"),

eventsRouter.patch("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;

  let eventData;

  try {
    // eventData = JSON.parse(req.body.eventData);
    console.log(req.body);
    eventData = JSON.parse(req.body.eventData);
  } catch (error) {
    console.error("Error parsing eventData:", error);
    return res.status(400).send("Invalid event data");
  }
  console.log(eventData);

  const {
    title,
    shortdescription,
    longdescription,
    date,
    openingtime,
    street,
    postcode,
    city,
    agerestriction,
    accessibilityinfo,
    ticketprice,
    createdby,
    image,
  } = eventData;

  // const image = req.file ? req.file.buffer : undefined;

  let imageBuffer;
  if (image && image.startsWith("data:image/")) {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    imageBuffer = Buffer.from(base64Data, "base64");
  }

  try {
    const result = await updateEvent(id, {
      title,
      shortdescription,
      longdescription,
      date,
      openingtime,
      street,
      postcode,
      city,
      agerestriction,
      accessibilityinfo,
      image: imageBuffer, // Include image binary data if uploaded
      ticketprice,
      createdby: 17,
    });

    if (result.rows.length === 0) {
      return res.status(404).send("Event not found");
    }

    res
      .status(200)
      .json({ message: "Event updated successfully", result: result.rows[0] });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).send("Server error");
  }
});

// Delete an event by ID
eventsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteEvent(id);
    if (result.length === 0 || !result) {
      return res.status(404).send("Event not found");
    }
    res.json(result);
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).send("Server error");
  }
});

// export default eventsRouter;

module.exports = eventsRouter;
