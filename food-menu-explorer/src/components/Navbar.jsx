import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const handleHomeClick = () => {
    setMenuOpen(false);

    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      navigate("/");
    }
  };

  const handleSectionClick = (sectionId) => {
    setMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      
      setTimeout(() => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);
    } else {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-orange-100 shadow-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="h-20 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={handleHomeClick}
            className="flex items-center gap-2"
          >
            <div className="w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center text-2xl shadow-sm">
              🍴
            </div>

            <div className="text-left">
              <h1 className="text-xl font-extrabold text-gray-900">
                FoodExplorer
              </h1>

              <p className="text-xs text-gray-400">
                Discover. Order. Enjoy.
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">

            {/* Home */}
            <button
              onClick={handleHomeClick}
              className={`font-semibold transition ${
                location.pathname === "/"
                  ? "text-orange-500"
                  : "text-gray-600 hover:text-orange-500"
              }`}
            >
              Home
            </button>

            {/* Categories */}
            <button
              onClick={() =>
                handleSectionClick("categories")
              }
              className="font-semibold text-gray-600 hover:text-orange-500 transition"
            >
              Categories
            </button>

            {/* Restaurants */}
            <button
              onClick={() =>
                handleSectionClick("restaurants")
              }
              className="font-semibold text-gray-600 hover:text-orange-500 transition"
            >
              Restaurants
            </button>

            {/* My Orders */}
            {user && (
              <Link
                to="/my-orders"
                className={`font-semibold transition ${
                  location.pathname === "/my-orders"
                    ? "text-orange-500"
                    : "text-gray-600 hover:text-orange-500"
                }`}
              >
                My Orders
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 text-gray-600 hover:text-orange-500 font-semibold transition"
            >
              <span className="text-xl">
                🛒
              </span>

              <span>
                Cart
              </span>

              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 min-w-[20px] h-5 px-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Authentication */}
            {user ? (
              <div className="flex items-center gap-3">

                <span className="text-sm text-gray-600">
                  Hi,{" "}
                  <span className="font-semibold text-gray-900">
                    {user.name}
                  </span>
                </span>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:border-red-200 hover:text-red-500 transition"
                >
                  Logout
                </button>

              </div>
            ) : (
              <Link
                to="/login"
                className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition"
              >
                Login
              </Link>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-xl"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-orange-100 py-4 space-y-2">

            {/* Home */}
            <button
              onClick={handleHomeClick}
              className="w-full text-left px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-500"
            >
              🏠 Home
            </button>

            {/* Categories */}
            <button
              onClick={() =>
                handleSectionClick("categories")
              }
              className="w-full text-left px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-500"
            >
              🍽️ Categories
            </button>

            {/* Restaurants */}
            <button
              onClick={() =>
                handleSectionClick("restaurants")
              }
              className="w-full text-left px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-500"
            >
              🏪 Restaurants
            </button>

            {/* My Orders */}
            {user && (
              <Link
                to="/my-orders"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-500"
              >
                📦 My Orders
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-500"
            >
              <span>
                🛒 Cart
              </span>

              {cartCount > 0 && (
                <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Authentication */}
            {user ? (
              <>
                <div className="px-4 py-3 text-sm text-gray-500">
                  Logged in as{" "}
                  <span className="font-semibold text-gray-900">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-xl font-semibold text-red-500 hover:bg-red-50"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block bg-orange-500 text-white text-center px-4 py-3 rounded-xl font-semibold hover:bg-orange-600"
              >
                Login
              </Link>
            )}

          </div>
        )}

      </div>

    </nav>
  );
}

export default Navbar;