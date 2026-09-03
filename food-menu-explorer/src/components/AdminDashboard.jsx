import { useEffect, useState } from "react";

function AdminDashboard() {
  const [statistics, setStatistics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleStatusChange = async (orderId, newStatus) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/admin/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Failed to update order status."
      );
    }

    // Update the order immediately on screen
    setRecentOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
            }
          : order
      )
    );

  } catch (error) {
    console.error(
      "Status update error:",
      error
    );

    alert(
      error.message ||
      "Failed to update order status."
    );
  }
};

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load dashboard."
          );
        }

        setStatistics(data.statistics);
        setRecentOrders(data.recentOrders || []);
      } catch (error) {
        console.error("Admin dashboard error:", error);

        setError(
          error.message || "Unable to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-pulse">
            📊
          </div>

          <p className="mt-4 text-gray-600 font-semibold">
            Loading admin dashboard...
          </p>
        </div>
      </section>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-md">
          <div className="text-5xl">
            ⚠️
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Unable to load dashboard
          </h1>

          <p className="mt-3 text-red-500">
            {error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8">
          <p className="text-orange-500 font-bold uppercase tracking-wider text-sm">
            Administration
          </p>

          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Manage and monitor your FoodExplorer platform.
          </p>
        </div>

        {/* ==========================================
            STATISTICS
        ========================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

          {/* Users */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center justify-between">
              <span className="text-3xl">
                👥
              </span>

              <span className="text-xs font-semibold text-gray-400">
                USERS
              </span>
            </div>

            <p className="mt-5 text-3xl font-extrabold text-gray-900">
              {statistics?.totalUsers ?? 0}
            </p>

            <p className="mt-1 text-gray-500">
              Total Users
            </p>
          </div>

          {/* Restaurants */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center justify-between">
              <span className="text-3xl">
                🏪
              </span>

              <span className="text-xs font-semibold text-gray-400">
                RESTAURANTS
              </span>
            </div>

            <p className="mt-5 text-3xl font-extrabold text-gray-900">
              {statistics?.totalRestaurants ?? 0}
            </p>

            <p className="mt-1 text-gray-500">
              Restaurants
            </p>
          </div>

          {/* Menu */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center justify-between">
              <span className="text-3xl">
                🍽️
              </span>

              <span className="text-xs font-semibold text-gray-400">
                MENU
              </span>
            </div>

            <p className="mt-5 text-3xl font-extrabold text-gray-900">
              {statistics?.totalMenuItems ?? 0}
            </p>

            <p className="mt-1 text-gray-500">
              Menu Items
            </p>
          </div>

          {/* Orders */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center justify-between">
              <span className="text-3xl">
                📦
              </span>

              <span className="text-xs font-semibold text-gray-400">
                ORDERS
              </span>
            </div>

            <p className="mt-5 text-3xl font-extrabold text-gray-900">
              {statistics?.totalOrders ?? 0}
            </p>

            <p className="mt-1 text-gray-500">
              Total Orders
            </p>
          </div>

          {/* Revenue */}

          <div className="bg-gray-950 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-3xl">
                💰
              </span>

              <span className="text-xs font-semibold text-gray-400">
                REVENUE
              </span>
            </div>

            <p className="mt-5 text-3xl font-extrabold text-orange-400">
              ₹{Number(
                statistics?.totalRevenue ?? 0
              ).toFixed(0)}
            </p>

            <p className="mt-1 text-gray-400">
              Total Revenue
            </p>
          </div>

        </div>

        {/* ==========================================
            RECENT ORDERS
        ========================================== */}

        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">

          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Orders
            </h2>

            <p className="mt-1 text-gray-500 text-sm">
              Latest orders placed on FoodExplorer.
            </p>
          </div>

          {recentOrders.length === 0 ? (

            <div className="p-10 text-center">
              <div className="text-5xl">
                📦
              </div>

              <p className="mt-4 text-gray-500">
                No orders yet.
              </p>
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-bold text-gray-600">
                      Order ID
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-bold text-gray-600">
                      Customer
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-bold text-gray-600">
                      Restaurant
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-bold text-gray-600">
                      Amount
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-bold text-gray-600">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-bold text-gray-600">
                      Date
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {recentOrders.map((order) => (

                    <tr
                      key={order.id}
                      className="border-t border-gray-100 hover:bg-orange-50 transition"
                    >

                      <td className="px-6 py-4 font-bold text-gray-900">
                        #{order.id}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {order.user_name}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {order.restaurant_name}
                      </td>

                      <td className="px-6 py-4 font-semibold text-orange-500">
                        ₹{Number(order.total_amount).toFixed(0)}
                      </td>

                    <td className="px-6 py-4">

  <select
    value={order.status}
    onChange={(e) =>
      handleStatusChange(
        order.id,
        e.target.value
      )
    }
    className={`px-3 py-2 rounded-lg text-sm font-semibold border outline-none ${
      order.status === "Pending"
        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
        : order.status === "Confirmed"
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : order.status === "Preparing"
        ? "bg-orange-50 text-orange-700 border-orange-200"
        : order.status === "Out for Delivery"
        ? "bg-purple-50 text-purple-700 border-purple-200"
        : order.status === "Delivered"
        ? "bg-green-50 text-green-700 border-green-200"
        : order.status === "Cancelled"
        ? "bg-red-50 text-red-700 border-red-200"
        : "bg-gray-50 text-gray-700 border-gray-200"
    }`}
  >
    <option value="Pending">
      Pending
    </option>

    <option value="Confirmed">
      Confirmed
    </option>

    <option value="Preparing">
      Preparing
    </option>

    <option value="Out for Delivery">
      Out for Delivery
    </option>

    <option value="Delivered">
      Delivered
    </option>

    <option value="Cancelled">
      Cancelled
    </option>
  </select>

</td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(
                          order.created_at
                        ).toLocaleDateString()}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </section>
  );
}

export default AdminDashboard;