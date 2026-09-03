const express = require("express");

const router = express.Router();

module.exports = (db) => {
  // ==========================================
  // GET ALL RESTAURANTS
  // ==========================================

  router.get("/", async (req, res) => {
    try {
      const [restaurants] = await db.query(
        "SELECT * FROM restaurants ORDER BY id DESC"
      );

      res.json({
        success: true,
        restaurants,
      });
    } catch (error) {
      console.error("Error fetching restaurants:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch restaurants.",
      });
    }
  });


  // ==========================================
  // GET RESTAURANT BY ID
  // ==========================================

  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const [restaurants] = await db.query(
        "SELECT * FROM restaurants WHERE id = ?",
        [id]
      );

      if (restaurants.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found.",
        });
      }

      res.json({
        success: true,
        restaurant: restaurants[0],
      });
    } catch (error) {
      console.error("Error fetching restaurant:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch restaurant.",
      });
    }
  });


  // ==========================================
  // GET MENU ITEMS FOR A RESTAURANT
  // ==========================================

  router.get("/:id/menu", async (req, res) => {
    try {
      const { id } = req.params;

      // First check whether restaurant exists
      const [restaurants] = await db.query(
        "SELECT id FROM restaurants WHERE id = ?",
        [id]
      );

      if (restaurants.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found.",
        });
      }

      // Get menu items
      const [menuItems] = await db.query(
        `
        SELECT
          id,
          restaurant_id,
          name,
          description,
          price,
          image,
          category,
          is_available,
          created_at
        FROM menu_items
        WHERE restaurant_id = ?
        ORDER BY id ASC
        `,
        [id]
      );

      res.json({
        success: true,
        menuItems,
      });
    } catch (error) {
      console.error("Error fetching menu:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch menu.",
      });
    }
  });


  return router;
};
