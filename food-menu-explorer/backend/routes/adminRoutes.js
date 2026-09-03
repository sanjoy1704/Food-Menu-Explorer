const express = require("express");

const router = express.Router();

module.exports = (db) => {
  // ==========================================
  // ADMIN DASHBOARD STATISTICS
  // ==========================================

  router.get("/dashboard", async (req, res) => {
    try {
      // Total users
      const [users] = await db.query(
        "SELECT COUNT(*) AS totalUsers FROM users"
      );

      // Total restaurants
      const [restaurants] = await db.query(
        "SELECT COUNT(*) AS totalRestaurants FROM restaurants"
      );

      // Total menu items
      const [menuItems] = await db.query(
        "SELECT COUNT(*) AS totalMenuItems FROM menu_items"
      );

      // Total orders
      const [orders] = await db.query(
        "SELECT COUNT(*) AS totalOrders FROM orders"
      );

      // Total revenue
      const [revenue] = await db.query(
        `
        SELECT COALESCE(SUM(total_amount), 0) AS totalRevenue
        FROM orders
        WHERE status != 'Cancelled'
        `
      );

      // Recent orders
      const [recentOrders] = await db.query(
        `
        SELECT
          o.id,
          u.name AS user_name,
          r.name AS restaurant_name,
          o.total_amount,
          o.status,
          o.created_at
        FROM orders o
        JOIN users u
          ON o.user_id = u.id
        JOIN restaurants r
          ON o.restaurant_id = r.id
        ORDER BY o.created_at DESC
        LIMIT 10
        `
      );

      res.json({
        success: true,

        statistics: {
          totalUsers: users[0].totalUsers,
          totalRestaurants: restaurants[0].totalRestaurants,
          totalMenuItems: menuItems[0].totalMenuItems,
          totalOrders: orders[0].totalOrders,
          totalRevenue: revenue[0].totalRevenue,
        },

        recentOrders,
      });

    } catch (error) {
      console.error("Admin dashboard error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to load admin dashboard.",
      });
    }
  });

  // ==========================================
// UPDATE ORDER STATUS
// ==========================================

router.put("/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const [result] = await db.query(
      `
      UPDATE orders
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully.",
    });

  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status.",
    });
  }
});

  return router;
};