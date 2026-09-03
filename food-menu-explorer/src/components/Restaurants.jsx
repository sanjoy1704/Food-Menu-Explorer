import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import RestaurantCard from "./RestaurantCard";

function Restaurants() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";

  // Fetch restaurants from backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/restaurants"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch restaurants."
          );
        }

        setRestaurants(data.restaurants || []);
      } catch (error) {
        console.error("Restaurant fetch error:", error);

        setError(
          "Unable to load restaurants. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = useMemo(() => {
    let result = restaurants;

    // Search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();

      result = result.filter((restaurant) => {
        return (
          restaurant.name?.toLowerCase().includes(query) ||
          restaurant.cuisine?.toLowerCase().includes(query) ||
          restaurant.location?.toLowerCase().includes(query)
        );
      });
    }

    // Category filtering
    if (categoryQuery) {
      const category = categoryQuery.toLowerCase();

      result = result.filter((restaurant) =>
        restaurant.cuisine?.toLowerCase().includes(category)
      );
    }

    return result;
  }, [restaurants, searchQuery, categoryQuery]);

  const clearFilters = () => {
    setSearchParams({});
  };

  let heading = "Popular Restaurants";

  if (categoryQuery) {
    heading = `${categoryQuery} Restaurants`;
  } else if (searchQuery) {
    heading = `Search Results for "${searchQuery}"`;
  }

  return (
    <section
      id="restaurants"
      className="py-20 sm:py-24 bg-orange-50"
    >
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">

          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              {heading}
            </h2>

            <p className="mt-3 text-gray-600">
              {loading
                ? "Loading restaurants..."
                : `${filteredRestaurants.length} restaurant(s) found`}
            </p>
          </div>

          {(searchQuery || categoryQuery) && (
            <button
              onClick={clearFilters}
              className="mt-4 md:mt-0 text-orange-500 font-semibold hover:text-orange-600"
            >
              Clear Filter ✕
            </button>
          )}

        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">

            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="h-52 bg-gray-200" />

                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white rounded-2xl p-12 text-center">

            <div className="text-6xl">
              ⚠️
            </div>

            <h3 className="mt-5 text-2xl font-bold text-gray-900">
              Something went wrong
            </h3>

            <p className="mt-2 text-gray-500">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600"
            >
              Try Again
            </button>

          </div>
        )}

        {/* Restaurant Cards */}
        {!loading && !error && filteredRestaurants.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">

            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={{
                  ...restaurant,

                  // Convert database fields to the format
                  // expected by the existing card
                  cuisine: restaurant.cuisine,
                  rating: String(restaurant.rating),
                  image: restaurant.image,
                  location: restaurant.location,
                  price: "₹₹",
                }}
              />
            ))}

          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredRestaurants.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center">

            <div className="text-6xl">
              🍽️
            </div>

            <h3 className="mt-5 text-2xl font-bold text-gray-900">
              No restaurants found
            </h3>

            <p className="mt-2 text-gray-500">
              Try another search or category.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600"
            >
              Show All Restaurants
            </button>

          </div>
        )}

      </div>
    </section>
  );
}

export default Restaurants;