// import express from "express";
const express = require("express");
const {
  getAdminById,
  getAllAdmins,
  createAdmin,
} = require("../queries/adminQueries");
// import { getAdminById, getAllAdmins } from "../queries/adminQueries";

const adminRouter = express.Router();

// Get all admins
adminRouter.get("/", async (req, res) => {
  try {
    const result = await getAllAdmins();
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching admins:", err);
    res.status(500).send("Server error");
  }
});

// Get a single admin by ID
adminRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getAdminById(id);
    if (result.length === 0 || !result) {
      return res.status(404).send("Admin not found");
    }
    res.json(result);
  } catch (err) {
    console.error("Error fetching admin:", err);
    res.status(500).send("Server error");
  }
});

// Create a new admin
adminRouter.post("/create", async (req, res) => {
  const { userName, password } = req.body;

  try {
    // Call createAdmin function from adminQueries with userName and password
    const newAdmin = await createAdmin(userName, password);
    res.status(201).json(newAdmin);
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).send("Server error");
  }
});
// // Update an admin by ID
// adminRouter.put("/:id", async (req, res) => {
//   const { id } = req.params;
//   const { userName, password } = req.body;
//   try {
//     const result = await db.query(
//       "UPDATE admin SET userName = $1, password = $2 WHERE userId = $3 RETURNING *",
//       [userName, password, id]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).send("Admin not found");
//     }
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error("Error updating admin:", err);
//     res.status(500).send("Server error");
//   }
// });

// // Delete an admin by ID
// adminRouter.delete("/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await db.query(
//       "DELETE FROM admin WHERE userId = $1 RETURNING *",
//       [id]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).send("Admin not found");
//     }
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error("Error deleting admin:", err);
//     res.status(500).send("Server error");
//   }
// });

// export default adminRouter;
module.exports = adminRouter;
