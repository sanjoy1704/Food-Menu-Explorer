const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

module.exports = (db) => {
  // ==========================================
  // CREATE ORDER
  // ==========================================

  router.post("/", authMiddleware, async (req, res) => {
    const connection = await db.getConnection();

    try {
      const {
  restaurant_id,
  items,
  total_amount,
} = req.body;

const user_id = req.user.id;
      // Basic validation
      if (
        !user_id ||
        !restaurant_id ||
        !items ||
        items.length === 0 ||
        total_amount === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing order information.",
        });
      }

      await connection.beginTransaction();

      // ==========================================
      // CREATE ORDER
      // ==========================================

      const [orderResult] = await connection.query(
        `
        INSERT INTO orders
        (user_id, restaurant_id, total_amount, status)
        VALUES (?, ?, ?, ?)
        `,
        [
          user_id,
          restaurant_id,
          total_amount,
          "Pending",
        ]
      );

      const orderId = orderResult.insertId;

      // ==========================================
      // CREATE ORDER ITEMS
      // ==========================================

      for (const item of items) {
        await connection.query(
          `
          INSERT INTO order_items
          (order_id, menu_item_id, quantity, price)
          VALUES (?, ?, ?, ?)
          `,
          [
            orderId,
            item.menu_item_id,
            item.quantity,
            item.price,
          ]
        );
      }

      await connection.commit();

      res.status(201).json({
        success: true,
        message: "Order created successfully.",
        orderId,
      });

    } catch (error) {
      await connection.rollback();

      console.error("Error creating order:", error);

      res.status(500).json({
        success: false,
        message: "Failed to create order.",
      });

    } finally {
      connection.release();
    }
  });


  // ==========================================
  // GET USER ORDERS
  // ==========================================

 router.get("/user/:userId", authMiddleware, async (req, res) => {
    try {
      const { userId } = req.params;

      const [orders] = await db.query(
        `
        SELECT
          o.id,
          o.restaurant_id,
          r.name AS restaurant_name,
          o.total_amount,
          o.status,
          o.created_at
        FROM orders o
        JOIN restaurants r
          ON o.restaurant_id = r.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
        `,
        [userId]
      );

      res.json({
        success: true,
        orders,
      });

    } catch (error) {
      console.error("Error fetching orders:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch orders.",
      });
    }
  });


  // ==========================================
  // GET ONE ORDER
  // ==========================================

  router.get("/:id", authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;

    const [orders] = await db.query(
  `
  SELECT
    o.id,
    o.user_id,
    o.restaurant_id,
    r.name AS restaurant_name,
    o.total_amount,
    o.status,
    o.created_at
  FROM orders o
  JOIN restaurants r
    ON o.restaurant_id = r.id
  WHERE o.id = ?
    AND o.user_id = ?
  `,
  [id, req.user.id]
);
      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      const [items] = await db.query(
        `
        SELECT
          oi.id,
          oi.menu_item_id,
          m.name AS menu_item_name,
          oi.quantity,
          oi.price
        FROM order_items oi
        JOIN menu_items m
          ON oi.menu_item_id = m.id
        WHERE oi.order_id = ?
        `,
        [id]
      );

      res.json({
        success: true,
        order: orders[0],
        items,
      });

    } catch (error) {
      console.error("Error fetching order:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch order.",
      });
    }
  });


  return router;
};