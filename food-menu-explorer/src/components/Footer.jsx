function Footer() {
  return (
   <footer className="bg-gray-950 text-white">

      <div className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-extrabold">
  Food<span className="text-orange-500">Explorer</span>
</h2>

            <p className="mt-4 text-gray-400 leading-relaxed">
              Discover restaurants, explore delicious food,
              and find your favorite dishes all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <a href="/" className="text-gray-400 hover:text-white">
                Home
              </a>

              <a href="/" className="text-gray-400 hover:text-white">
                Restaurants
              </a>

              <a href="/" className="text-gray-400 hover:text-white">
                Categories
              </a>

              <a href="/cart" className="text-gray-400 hover:text-white">
                Cart
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold">
              Popular Categories
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <span className="text-gray-400">
                🍕 Pizza
              </span>

              <span className="text-gray-400">
                🍔 Burgers
              </span>

              <span className="text-gray-400">
                🍛 Indian
              </span>

              <span className="text-gray-400">
                🥡 Chinese
              </span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold">
              Contact
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-gray-400">
              <p>📍 Kolkata, India</p>
              <p>📧 support@foodexplorer.com</p>
              <p>📞 +91 98765 43210</p>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center">

          <p className="text-gray-500 text-sm">
            © 2026 FoodExplorer. All rights reserved.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;