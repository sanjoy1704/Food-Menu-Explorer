import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function RestaurantDetails() {
  const { id } = useParams();

  const { addToCart, cartCount } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH RESTAURANT + MENU
  // ==========================================

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        setLoading(true);
        setError("");

        // -------------------------------
        // Fetch restaurant
        // -------------------------------

        const restaurantResponse = await fetch(
          `http://localhost:5000/api/restaurants/${id}`
        );

        const restaurantData =
          await restaurantResponse.json();

        if (!restaurantResponse.ok) {
          throw new Error(
            restaurantData.message ||
              "Restaurant not found."
          );
        }

        setRestaurant(restaurantData.restaurant);

        // -------------------------------
        // Fetch menu from MySQL
        // -------------------------------

        const menuResponse = await fetch(
          `http://localhost:5000/api/restaurants/${id}/menu`
        );

        const menuData = await menuResponse.json();

        if (!menuResponse.ok) {
          throw new Error(
            menuData.message ||
              "Failed to fetch menu."
          );
        }

        setMenu(menuData.menuItems || []);

      } catch (error) {
        console.error(
          "Restaurant details error:",
          error
        );

        setError(
          error.message ||
            "Unable to load restaurant."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndMenu();
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">

          <div className="text-5xl animate-pulse">
            🍽️
          </div>

          <p className="mt-4 text-gray-600 font-medium">
            Loading restaurant...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

        <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-md">

          <div className="text-6xl">
            🍽️
          </div>

          <h1 className="mt-5 text-3xl font-bold text-gray-800">
            Restaurant not found
          </h1>

          <p className="mt-3 text-gray-500">
            {error ||
              "We couldn't find this restaurant."}
          </p>

          <Link
            to="/"
            className="inline-block mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
          >
            Back to Home
          </Link>

        </div>

      </div>
    );
  }

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = (item) => {
    if (!item.is_available) {
      toast.error(`${item.name} is currently unavailable.`);
      return;
    }

    addToCart(item, restaurant);

    toast.success(
      `${item.name} added to cart!`
    );
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================
          RESTAURANT HEADER
      ===================================== */}

      <div className="bg-white">

        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-72 object-cover"
        />

        <div className="max-w-7xl mx-auto px-4 py-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h1 className="text-4xl font-bold text-gray-900">
                {restaurant.name}
              </h1>

              <p className="mt-2 text-gray-600">
                {restaurant.cuisine}
              </p>

              <p className="mt-2 text-gray-500">
                📍 {restaurant.location}
              </p>

              {restaurant.delivery_time && (
                <p className="mt-2 text-gray-500">
                  🕐 {restaurant.delivery_time}
                </p>
              )}

            </div>

            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold">
              ⭐ {restaurant.rating}
            </div>

          </div>

          <p className="mt-6 text-gray-600 max-w-3xl">
            {restaurant.description}
          </p>

        </div>

      </div>

      {/* =====================================
          MENU
      ===================================== */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-3xl font-bold text-gray-900">
            Menu
          </h2>

          <Link
            to="/cart"
            className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl font-semibold hover:bg-orange-200 transition"
          >
            🛒 {cartCount}
          </Link>

        </div>

        {/* =====================================
            NO MENU
        ===================================== */}

        {menu.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">

            <div className="text-5xl">
              🍽️
            </div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              No menu items available
            </h3>

            <p className="mt-2 text-gray-500">
              This restaurant has no menu items at the moment.
            </p>

          </div>
        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {menu.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >

                <div className="flex justify-between gap-4">

                  <div className="flex-1">

                    <h3 className="text-xl font-bold text-gray-900">
                      {item.name}
                    </h3>

                    {item.category && (
                      <p className="mt-1 text-sm text-orange-500 font-medium">
                        {item.category}
                      </p>
                    )}

                    <p className="mt-2 text-gray-500">
                      {item.description}
                    </p>

                  </div>

                  <span className="text-orange-500 font-bold text-lg whitespace-nowrap">
                    ₹{Number(item.price).toFixed(0)}
                  </span>

                </div>

                {/* =================================
                    ADD BUTTON
                ================================= */}

                <button
                  type="button"
                  disabled={!item.is_available}
                  onClick={() =>
                    handleAddToCart(item)
                  }
                  className={`mt-5 px-5 py-2 rounded-lg transition font-semibold ${
                    item.is_available
                      ? "border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {item.is_available
                    ? "Add"
                    : "Unavailable"}
                </button>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default RestaurantDetails;