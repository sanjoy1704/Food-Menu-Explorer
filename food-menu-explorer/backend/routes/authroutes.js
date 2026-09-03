const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

module.exports = (db) => {

  // =========================
  // REGISTER
  // =========================

  router.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, email and password are required.",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters.",
        });
      }

      const [existingUsers] = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );

      res.status(201).json({
        success: true,
        message: "Account created successfully!",
        userId: result.insertId,
      });

    } catch (error) {
      console.error("Registration error:", error);

      res.status(500).json({
        success: false,
        message: "Server error during registration.",
      });
    }
  });


  // =========================
  // LOGIN
  // =========================

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required.",
        });
      }

      // Find user
      const [users] = await db.query(
  "SELECT id, name, email, password, role FROM users WHERE email = ?",
  [email]
);

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      const user = users[0];

      // Check password
      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      // Create JWT
     const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

      // Send response
      res.json({
        success: true,
        message: "Login successful!",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });

    } catch (error) {
      console.error("Login error:", error);

      res.status(500).json({
        success: false,
        message: "Server error during login.",
      });
    }
  });


  return router;
};
