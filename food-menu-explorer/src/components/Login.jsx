import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      // Save login information
      login(data.user, data.token);

      // Show success message inside the website
      setSuccess(`Login successful! Welcome back, ${data.user.name}.`);

      const destination = location.state?.from || "/";

      // Give the user a moment to see the message
      setTimeout(() => {
        navigate(destination, {
          replace: true,
        });
      }, 800);
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-80px)] bg-orange-50 flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-6 sm:p-8">

          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center text-3xl shadow-lg">
              🍴
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mt-6">

            <h1 className="text-3xl font-extrabold text-gray-900">
              Welcome Back
            </h1>

            <p className="mt-2 text-gray-500">
              Login to continue exploring great food.
            </p>

          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
              ✓ {success}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
              />

            </div>

            {/* Password */}
            <div>

              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
              />

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3.5 rounded-xl font-bold shadow-sm hover:shadow-lg transition active:scale-[0.98]"
            >
              {loading
                ? "Logging in..."
                : success
                ? "Login Successful ✓"
                : "Login"}
            </button>

          </form>

          {/* Register */}
          <p className="text-center text-sm text-gray-500 mt-7">

            Don't have an account?

            <Link
              to="/register"
              className="ml-1 text-orange-500 font-semibold hover:text-orange-600"
            >
              Create Account
            </Link>

          </p>

          {/* Home */}
          <Link
            to="/"
            className="block mt-5 text-center text-sm text-gray-500 hover:text-orange-500 transition"
          >
            ← Back to Home
          </Link>

        </div>

      </div>

    </section>
  );
}

export default Login;