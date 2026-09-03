import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Pizza",
    emoji: "🍕",
    description: "Cheesy & delicious",
  },
  {
    name: "Burgers",
    emoji: "🍔",
    description: "Juicy & satisfying",
  },
  {
    name: "Indian",
    emoji: "🍛",
    description: "Rich Indian flavors",
  },
  {
    name: "Chinese",
    emoji: "🥡",
    description: "Asian favorites",
  },
  {
    name: "Desserts",
    emoji: "🍰",
    description: "Sweet treats",
  },
  {
  name: "Cafe",
  emoji: "☕",
  description: "Coffee & snacks",
},
];

function Categories() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/?category=${encodeURIComponent(category)}`);
  };

  return (
    <section
  id="categories"
  className="py-16 sm:py-20 bg-orange-50"
>

      <div className="max-w-7xl mx-auto px-4">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">

          <div>
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">
              Explore
            </span>

            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">
              What are you craving?
            </h2>

            <p className="mt-3 text-gray-600 max-w-xl">
              Browse popular food categories and discover something
              delicious for your next meal.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="hidden sm:block text-orange-500 font-semibold hover:text-orange-600 transition"
          >
            View All →
          </button>

        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

          {categories.map((category) => (

            <button
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="group relative overflow-hidden bg-white rounded-2xl p-5 sm:p-6 text-center border border-orange-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >

              {/* Hover Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10">

                {/* Emoji */}
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-orange-50 group-hover:bg-white/20 rounded-2xl transition duration-300">

                  <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300">
                    {category.emoji}
                  </span>

                </div>

                {/* Name */}
                <h3 className="mt-4 font-bold text-gray-900 group-hover:text-white transition">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="mt-1 text-xs sm:text-sm text-gray-500 group-hover:text-orange-100 transition">
                  {category.description}
                </p>

              </div>

            </button>

          ))}

        </div>

        {/* Mobile View All */}
        <button
          onClick={() => navigate("/")}
          className="sm:hidden mt-6 w-full border border-orange-200 bg-white text-orange-500 font-semibold py-3 rounded-xl"
        >
          View All Categories →
        </button>

      </div>

    </section>
  );
}

export default Categories;