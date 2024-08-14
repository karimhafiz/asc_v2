const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // For hashing passwords
const db = require("../db");

const loginRouter = express.Router();

// Step 3: Adding JWT token generation
loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch admin credentials from the database
    const result = await db.query("SELECT * FROM admin WHERE username = $1", [
      username,
    ]);
    const admin = result.rows[0];

    // Debugging output
    console.log(`Fetched admin: ${JSON.stringify(admin)}`);

    if (!admin) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare the plain text password with the hashed password
    const passwordMatch = await bcrypt.compare(password, admin.password);
    console.log(`Password match result: ${passwordMatch}`);

    if (passwordMatch) {
      // Passwords match, generate token
      const token = jwt.sign(
        { username: admin.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token });
    } else {
      // Passwords don't match
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    // Error occurred during database query or password comparison
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = loginRouter;
