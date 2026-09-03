import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // ==========================================
  // GET LOGGED-IN USER FROM JWT
  // ==========================================

  const getUserFromToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      return payload;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  // ==========================================
  // CHECKOUT
  // ==========================================

  const handleCheckout = async () => {
    setCheckoutError("");

    const user = getUserFromToken();

    // User must be logged in
    if (!user) {
      setCheckoutError(
        "Please login before placing your order."
      );
      return;
    }

    if (!user.id) {
      setCheckoutError(
        "Unable to identify your account. Please login again."
      );
      return;
    }

    if (cartItems.length === 0) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    // All cart items belong to one restaurant
    const restaurantId = cartItems[0].restaurantId;

    setCheckoutLoading(true);

    try {
      const orderItems = cartItems.map((item) => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
      }));

    const token = localStorage.getItem("token");

const response = await fetch(
  "http://localhost:5000/api/orders",
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      user_id: user.id,
      restaurant_id: restaurantId,
      items: orderItems,
      total_amount: Number(cartTotal) + 40,
    }),
  }
);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order."
        );
      }

      // Clear cart after successful order
      clearCart();

      // Go to success page
      navigate("/order-success", {
        state: {
          orderId: data.orderId,
        },
      });

    } catch (error) {
      console.error("Checkout error:", error);

      setCheckoutError(
        error.message || "Unable to place order."
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cartItems.length === 0) {
    return (
      <section className="min-h-[75vh] bg-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">

          <div className="mx-auto w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center text-5xl">
            🛒
          </div>

          <h1 className="mt-7 text-3xl sm:text-4xl font-extrabold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-gray-500 leading-relaxed">
            Looks like you haven't added anything yet.
            Discover some delicious food and start your order.
          </p>

          <Link
            to="/"
            className="inline-flex mt-7 bg-orange-500 text-white px-7 py-3 rounded-xl font-semibold hover:bg-orange-600 hover:shadow-lg transition"
          >
            Explore Restaurants →
          </Link>

        </div>
      </section>
    );
  }

  // ==========================================
  // CART
  // ==========================================

  return (
    <section className="min-h-screen bg-orange-50 py-10 sm:py-14">

      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">

          <div>
            <span className="text-orange-500 text-sm font-bold uppercase tracking-wider">
              Order
            </span>

            <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold text-gray-900">
              Your Cart
            </h1>

            <p className="mt-2 text-gray-500">
              Review your items before checkout.
            </p>
          </div>

          <button
            onClick={clearCart}
            className="self-start sm:self-auto text-sm font-semibold text-red-500 hover:text-red-600"
          >
            Clear Cart
          </button>

        </div>

        {/* Checkout Error */}

        {checkoutError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3">
            {checkoutError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Cart Items */}

          <div className="lg:col-span-2 space-y-4">

            {cartItems.map((item) => (

              <div
                key={`${item.restaurantId}-${item.id}`}
                className="bg-white rounded-2xl border border-orange-100 p-5 shadow-sm hover:shadow-md transition"
              >

                <div className="flex flex-col sm:flex-row sm:items-center gap-5">

                  {/* Food Icon */}

                  <div className="w-16 h-16 shrink-0 rounded-xl bg-orange-50 flex items-center justify-center text-3xl">
                    🍽️
                  </div>

                  {/* Details */}

                  <div className="flex-1 min-w-0">

                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {item.restaurantName}
                    </p>

                    <p className="mt-2 text-orange-500 font-semibold">
                      ₹{item.price}
                    </p>

                  </div>

                  {/* Quantity */}

                  <div className="flex items-center">

                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id,
                          item.restaurantId
                        )
                      }
                      className="w-9 h-9 rounded-l-lg border border-gray-200 hover:bg-orange-50 text-gray-700 font-bold"
                    >
                      −
                    </button>

                    <div className="w-10 h-9 border-t border-b border-gray-200 flex items-center justify-center font-bold text-gray-900">
                      {item.quantity}
                    </div>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id,
                          item.restaurantId
                        )
                      }
                      className="w-9 h-9 rounded-r-lg bg-orange-500 text-white hover:bg-orange-600 font-bold"
                    >
                      +
                    </button>

                  </div>

                  {/* Total */}

                  <div className="sm:text-right min-w-[90px]">

                    <p className="font-bold text-gray-900 text-lg">
                      ₹{Number(item.price) * item.quantity}
                    </p>

                    <button
                      onClick={() =>
                        removeFromCart(
                          item.id,
                          item.restaurantId
                        )
                      }
                      className="mt-1 text-xs text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* Summary */}

          <div className="lg:sticky lg:top-24 h-fit">

            <div className="bg-gray-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl">

              <h2 className="text-2xl font-bold">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>
                    ₹{Number(cartTotal).toFixed(0)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Delivery Fee</span>
                  <span>₹40</span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Taxes</span>
                  <span>₹0</span>
                </div>

              </div>

              <div className="border-t border-gray-700 mt-6 pt-5 flex justify-between items-center">

                <span className="text-lg font-semibold">
                  Total
                </span>

                <span className="text-2xl font-extrabold text-orange-400">
                  ₹{Number(cartTotal) + 40}
                </span>

              </div>

              {/* Checkout Button */}

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className={`mt-7 w-full text-white py-3.5 rounded-xl font-bold transition ${
                  checkoutLoading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 hover:shadow-lg active:scale-[0.98]"
                }`}
              >
                {checkoutLoading
                  ? "Placing Order..."
                  : "Proceed to Checkout →"}
              </button>

              <Link
                to="/"
                className="mt-4 block text-center text-gray-400 hover:text-white text-sm"
              >
                ← Continue Shopping
              </Link>

            </div>

            {/* Security Note */}

            <div className="mt-4 bg-white border border-orange-100 rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-500">
                🔒 Secure checkout
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Cart;