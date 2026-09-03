import { Link } from "react-router-dom";

function RestaurantCard({ restaurant }) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-orange-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

      {/* Image */}
      <div className="relative overflow-hidden">

        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-52 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Rating */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
          <span className="text-sm font-bold text-gray-900">
            ⭐ {restaurant.rating}
          </span>
        </div>

        {/* Price */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          {restaurant.price}
        </div>

      </div>

      {/* Content */}
      <div className="p-5">

        {/* Restaurant Name */}
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition">
          {restaurant.name}
        </h3>

        {/* Cuisine */}
        <p className="mt-2 text-gray-500 text-sm">
          {restaurant.cuisine}
        </p>

        {/* Location */}
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <span>📍</span>
          <span>{restaurant.location}</span>
        </div>

        {/* Bottom */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">

          <div className="text-sm text-gray-500">
            🍽️ View menu
          </div>

          <Link
            to={`/restaurant/${restaurant.id}`}
            className="bg-orange-500 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-orange-600 hover:shadow-lg active:scale-95 transition"
          >
            View Menu →
          </Link>

        </div>

      </div>

    </div>
  );
}

export default RestaurantCard;