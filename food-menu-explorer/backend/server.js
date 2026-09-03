const express = require("express");
const cors = require("cors");
require("dotenv").config();

const mysql = require("mysql2/promise");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

const adminRoutes = require("./routes/adminRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
const restaurantRoutes = require("./routes/restaurantRoutes");

// Middleware
app.use(cors());
app.use(express.json());


// MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
app.use("/api/auth", authRoutes(db));
app.use("/api/restaurants", restaurantRoutes(db));
app.use("/api/orders", orderRoutes(db));
app.use("/api/admin", adminRoutes(db));

// Test database connection
async function testDatabaseConnection() {
  try {
    const connection = await db.getConnection();

    console.log("MySQL database connected successfully!");

    connection.release();
  } catch (error) {
    console.error("MySQL connection failed:");
    console.error(error.message);
  }
}

// Health API
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS result");

    res.json({
      success: true,
      message: "FoodExplorer backend and MySQL are connected!",
      database: rows[0].result === 1,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  await testDatabaseConnection();
});