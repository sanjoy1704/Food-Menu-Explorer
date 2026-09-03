import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      navigate("/");
      return;
    }

    navigate(`/?search=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950">

      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />

      <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-24 lg:py-32">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="text-center lg:text-left">

            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-orange-300 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              <span>🔥</span>
              <span>Discover delicious food near you</span>
            </div>

            {/* Heading */}
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight">
              Find Your
              <span className="block text-orange-400">
                Perfect Meal
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-gray-300 leading-relaxed">
              Explore restaurants, discover amazing dishes, and
              find your next favorite meal — all in one place.
            </p>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="mt-8 max-w-2xl mx-auto lg:mx-0"
            >
              <div className="flex flex-col sm:flex-row bg-white rounded-2xl p-2 shadow-2xl">

                <div className="flex items-center flex-1 px-4">

                  <span className="text-xl mr-3">
                    🔍
                  </span>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search restaurants, food..."
                    className="w-full py-3 outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                  />

                </div>

                <button
                  type="submit"
                  className="mt-2 sm:mt-0 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3 rounded-xl transition duration-200"
                >
                  Search
                </button>

              </div>
            </form>

            {/* Quick Stats */}
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-6 text-sm">

              <div className="text-gray-300">
                <span className="font-bold text-white text-lg">
                  100+
                </span>
                <span className="ml-2">
                  Restaurants
                </span>
              </div>

              <div className="text-gray-300">
                <span className="font-bold text-white text-lg">
                  500+
                </span>
                <span className="ml-2">
                  Dishes
                </span>
              </div>

              <div className="text-gray-300">
                <span className="font-bold text-white text-lg">
                  4.8★
                </span>
                <span className="ml-2">
                  Average Rating
                </span>
              </div>

            </div>

          </div>

          {/* Right Food Visual */}
          <div className="relative hidden lg:block">

            <div className="relative mx-auto w-full max-w-lg">

              {/* Main Image */}
              <div className="rounded-[2rem] overflow-hidden shadow-2xl rotate-2">

                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
                  alt="Delicious food"
                  className="w-full h-[480px] object-cover"
                />

              </div>

              {/* Floating Rating Card */}
              <div className="absolute -left-8 top-16 bg-white rounded-2xl shadow-xl px-5 py-4">

                <div className="text-sm text-gray-500">
                  Customer Rating
                </div>

                <div className="mt-1 font-bold text-gray-900">
                  ⭐ 4.8 / 5
                </div>

              </div>

              {/* Floating Food Card */}
              <div className="absolute -right-8 bottom-12 bg-white rounded-2xl shadow-xl px-5 py-4">

                <div className="text-sm text-gray-500">
                  Most Popular
                </div>

                <div className="mt-1 font-bold text-gray-900">
                  🍕 Italian Pizza
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;