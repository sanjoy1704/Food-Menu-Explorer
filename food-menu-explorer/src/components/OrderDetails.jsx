import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
       const token = localStorage.getItem("token");

const response = await fetch(
  `http://localhost:5000/api/orders/${id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch order."
          );
        }

        setOrder(data.order);
        setItems(data.items || []);
      } catch (error) {
        console.error("Order details error:", error);

        setError(
          error.message || "Unable to fetch order details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <section className="min-h-[75vh] bg-orange-50 flex items-center justify-center">
        <div className="text-center">

          <div className="text-5xl mb-4">
            🍽️
          </div>

          <p className="text-gray-600 font-semibold">
            Loading order details...
          </p>

        </div>
      </section>
    );
  }

  // Error
  if (error) {
    return (
      <section className="min-h-[75vh] bg-orange-50 flex items-center justify-center px-4">

        <div className="text-center max-w-md">

          <div className="text-5xl mb-5">
            ⚠️
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Order Not Found
          </h1>

          <p className="mt-3 text-red-500">
            {error}
          </p>

          <Link
            to="/my-orders"
            className="inline-flex mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600"
          >
            ← Back to My Orders
          </Link>

        </div>

      </section>
    );
  }

 if (!order) {
  return null;
}

const foodSubtotal = items.reduce(
  (total, item) =>
    total + Number(item.price) * Number(item.quantity),
  0
);

const deliveryFee =
  Number(order.total_amount) - foodSubtotal;

  return (
    <section className="min-h-screen bg-orange-50 py-10 sm:py-14">

      <div className="max-w-5xl mx-auto px-4">

        {/* Back */}
        <Link
          to="/my-orders"
          className="inline-flex items-center text-orange-500 font-semibold hover:text-orange-600 mb-6"
        >
          ← Back to My Orders
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-6 sm:p-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>

              <span className="text-orange-500 text-sm font-bold uppercase tracking-wider">
                Order Details
              </span>

              <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
                Order #{order.id}
              </h1>

              <p className="mt-2 text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </p>

            </div>

            {/* Status */}
            <span
              className={`self-start sm:self-auto inline-flex px-5 py-2.5 rounded-full text-sm font-bold ${
                order.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : order.status === "Cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {order.status}
            </span>

          </div>

          {/* Restaurant */}
          <div className="mt-7 bg-orange-50 rounded-2xl p-5">

            <p className="text-sm text-gray-500">
              Restaurant
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              {order.restaurant_name}
            </h2>

          </div>

        </div>

        {/* Items */}
        <div className="mt-6">

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ordered Items
          </h2>

          <div className="space-y-4">

            {items.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5"
              >

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <h3 className="text-lg font-bold text-gray-900">
                      {item.menu_item_name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      ₹{Number(item.price).toFixed(0)} ×{" "}
                      {item.quantity}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-lg font-extrabold text-orange-500">
                      ₹
                      {(
                        Number(item.price) *
                        item.quantity
                      ).toFixed(0)}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Order Summary */}
<div className="mt-6 bg-gray-950 text-white rounded-3xl p-6 sm:p-7">

  <h2 className="text-xl font-bold mb-5">
    Order Summary
  </h2>

  <div className="space-y-4">

    {/* Food Subtotal */}
    <div className="flex justify-between text-gray-300">
      <span>Food Subtotal</span>

      <span>
        ₹{foodSubtotal.toFixed(0)}
      </span>
    </div>

    {/* Delivery Fee */}
    <div className="flex justify-between text-gray-300">
      <span>Delivery Fee</span>

      <span>
        ₹{deliveryFee.toFixed(0)}
      </span>
    </div>

  </div>

  {/* Final Total */}
  <div className="border-t border-gray-700 mt-5 pt-5 flex justify-between items-center">

    <span className="text-lg font-semibold">
      Order Total
    </span>

    <span className="text-3xl font-extrabold text-orange-400">
      ₹{Number(order.total_amount).toFixed(0)}
    </span>

  </div>

</div>
        {/* Continue Shopping */}
        <div className="text-center mt-8">

          <Link
            to="/"
            className="inline-flex bg-orange-500 text-white px-7 py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
          >
            Continue Shopping →
          </Link>

        </div>

      </div>

    </section>
  );
}

export default OrderDetails;