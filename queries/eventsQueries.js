// import db from "./db";
const db = require("../db");

const getAllEvents = async () => {
  const result = await db.query("SELECT * FROM eventtable");

  // Convert image buffer to base64 string for each event
  // result.rows.forEach((event) => {
  //   if (event.image) {
  //     event.image = `data:image/png;base64,${event.image.toString("base64")}`;
  //   }
  // });
  // console.log(result.rows);
  return result.rows;
};

const getEventById = async (id) => {
  const result = await db.query("SELECT * FROM eventtable WHERE id = $1", [id]);

  // Convert binary data to Base64
  // if (result.rows[0] && result.rows[0].image) {
  //   const base64Image = `data:image/png;base64,${result.rows[0].image.toString(
  //     "base64"
  //   )}`;
  //   result.rows[0].image = base64Image;
  // }
  return result.rows;
};

const createEvent = async (event) => {
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
    image,
    ticketprice,
    createdby,
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
      shortdescription,
      longdescription,
      date,
      openingtime,
      street,
      postcode,
      city,
      agerestriction,
      accessibilityinfo,
      image, // Use the binary image data
      ticketprice,
      createdby,
    ]
  );
};

const updateEvent = async (id, event) => {
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
    image,
    ticketprice,
    createdby,
  } = event;
  console.log(image);

  try {
    return db.query(
      `UPDATE eventtable SET
            title = $1, shortdescription = $2, longdescription = $3, date = $4,
            openingtime = $5, street = $6, postcode = $7, city = $8, agerestriction = $9,
            accessibilityinfo = $10, image = $11, ticketprice = $12, createdby = $13
        WHERE id = $14
        RETURNING *`,
      [
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
        image, // Use the binary image data
        ticketprice,
        createdby,
        id,
      ]
    );
  } catch (error) {
    console.error("Database update error:", error);
    throw error;
  }
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
