// import db from "./db";
const db = require("../db");
const bcrypt = require("bcrypt");

const getAllAdmins = async () => {
  return await db.query("SELECT * FROM admin");
};

const getAdminById = async (id) => {
  return await db.query("SELECT * FROM admin WHERE userId = $1", [id]);
};

const createAdmin = async (userName, password) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Insert the admin into the database
    const result = await db.query(
      "INSERT INTO admin (username, password) VALUES ($1, $2) RETURNING *",
      [userName, hashedPassword]
    );

    return result.rows[0];
  } catch (error) {
    // Handle error
    console.error("Error creating admin:", error);
    throw error; // Throw the error to be caught by the caller
  }
};

// const updateAdmin = async (id, userName, password) => {
//   return await db.query(
//     "UPDATE admin SET userName = $1, password = $2 WHERE userId = $3 RETURNING *",
//     [userName, password, id]
//   );
// };

// const deleteAdmin = async (id) => {
//   return await db.query("DELETE FROM admin WHERE userId = $1 RETURNING *", [id]);
// };

// export {
//   getAllAdmins,
//   getAdminById,
//   //   createAdmin,
//   //   updateAdmin,
//   //   deleteAdmin,
// };

module.exports = {
  getAllAdmins,
  getAdminById,
  createAdmin,
};
