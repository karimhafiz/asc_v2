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

// Get all events
eventsRouter.get("/", async (req, res) => {
  try {
    const result = await getAllEvents();
    res.json(result.rows);
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
eventsRouter.post("/create", async (req, res) => {
  const {
    title,
    shortDescription,
    longDescription,
    date,
    openingTime,
    street,
    postCode,
    city,
    ageRestriction,
    accessibilityInfo,
    image,
    ticketPrice,
    createdBy,
  } = req.body;
  try {
    const result = await createEvent({
      title,
      shortDescription,
      longDescription,
      date,
      openingTime,
      street,
      postCode,
      city,
      ageRestriction,
      accessibilityInfo,
      image,
      ticketPrice,
      createdBy,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).send("Server error");
  }
});

// Update an event by ID
eventsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    shortDescription,
    longDescription,
    date,
    openingTime,
    street,
    postCode,
    city,
    ageRestriction,
    accessibilityInfo,
    image,
    ticketPrice,
    createdBy,
  } = req.body;
  try {
    const result = await updateEvent(id, {
      title,
      shortDescription,
      longDescription,
      date,
      openingTime,
      street,
      postCode,
      city,
      ageRestriction,
      accessibilityInfo,
      image,
      ticketPrice,
      createdBy,
    });
    if (result.length === 0 || !result) {
      return res.status(404).send("Event not found");
    }
    res.json(result);
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
