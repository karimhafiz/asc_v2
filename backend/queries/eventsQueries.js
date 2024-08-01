// import db from "./db";
const db = require("../db");

const getAllEvents = async () => {
  return db.query("SELECT * FROM eventtable");
};

const getEventById = async (id) => {
  return db.query("SELECT * FROM eventtable WHERE id = $1", [id]);
};

const createEvent = async (event) => {
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
  } = event;
  return db.query(
    `INSERT INTO eventtable (
            title, shortDescription, longDescription, date, openingTime,
            street, postCode, city, ageRestriction, accessibilityInfo,
            image, ticketPrice, createdBy
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
    [
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
    ]
  );
};

const updateEvent = async (id, event) => {
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
  } = event;
  return db.query(
    `UPDATE eventtable SET
            title = $1, shortDescription = $2, longDescription = $3, date = $4,
            openingTime = $5, street = $6, postCode = $7, city = $8, ageRestriction = $9,
            accessibilityInfo = $10, image = $11, ticketPrice = $12, createdBy = $13
        WHERE id = $14
        RETURNING *`,
    [
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
      id,
    ]
  );
};

const deleteEvent = async (id) => {
  return db.query("DELETE FROM eventtable WHERE id = $1 RETURNING *", [id]);
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
