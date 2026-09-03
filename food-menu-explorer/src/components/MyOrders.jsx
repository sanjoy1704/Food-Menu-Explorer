import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MyOrders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 useEffect(() => {
  const fetchOrders = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/orders/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders."
        );
      }

      setOrders(data.orders || []);

    } catch (error) {
      console.error("Fetch orders error:", error);

      setError(
        error.message || "Unable to load your orders."
      );

    } finally {
      setLoading(false);
    }
  };

  // Fetch orders immediately
  fetchOrders();

  // Automatically refresh orders every 5 seconds
  const interval = setInterval(() => {
    fetchOrders();
  }, 5000);

  // Stop automatic refresh when leaving My Orders
  return () => clearInterval(interval);

}, [user]);

  if (loading) {
    return (
      <section className="min-h-[75vh] bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-pulse">
            🍽️
          </div>

          <p className="mt-4 text-gray-600 font-medium">
            Loading your orders...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-[75vh] bg-orange-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-md">
          <div className="text-5xl">⚠️</div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Unable to load orders
          </h1>

          <p className="mt-3 text-gray-500">
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="min-h-[75vh] bg-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center text-5xl">
            📦
          </div>

          <h1 className="mt-7 text-3xl font-extrabold text-gray-900">
            No orders yet
          </h1>

          <p className="mt-3 text-gray-500">
            You haven't placed any orders yet. Explore restaurants
            and order something delicious!
          </p>

          <Link
            to="/"
            className="inline-flex mt-7 bg-orange-500 text-white px-7 py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
          >
            Explore Restaurants →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-orange-50 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4">

        <div className="mb-8">
          <span className="text-orange-500 text-sm font-bold uppercase tracking-wider">
            Account
          </span>

          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-gray-900">
            My Orders
          </h1>

          <p className="mt-2 text-gray-500">
            View your previous orders and their status.
          </p>
        </div>

        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-orange-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                  <p className="text-sm text-gray-400">
                    Order #{order.id}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    {order.restaurant_name}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-2xl font-extrabold text-orange-500">
                    ₹{Number(order.total_amount).toFixed(0)}
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

              </div>

              <div className="border-t border-gray-100 mt-5 pt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Restaurant order
                </span>

                <Link
                  to={`/order/${order.id}`}
                  className="text-orange-500 font-semibold text-sm hover:text-orange-600"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default MyOrders;