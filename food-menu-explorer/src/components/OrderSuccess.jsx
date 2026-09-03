import { Link, useLocation } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();

  const orderId = location.state?.orderId;

  return (
    <section className="min-h-[75vh] bg-orange-50 flex items-center justify-center px-4">

      <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 text-center max-w-lg w-full">

        <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-5xl">
          ✓
        </div>

        <h1 className="mt-7 text-3xl sm:text-4xl font-extrabold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="mt-4 text-gray-500">
          Thank you for ordering with Food Explorer.
          Your order has been successfully placed.
        </p>

        {orderId && (
          <div className="mt-6 bg-orange-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Order ID
            </p>

            <p className="mt-1 text-xl font-bold text-orange-500">
              #{orderId}
            </p>
          </div>
        )}

        <Link
          to="/"
          className="inline-flex mt-7 bg-orange-500 text-white px-7 py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
        >
          Continue Shopping →
        </Link>

      </div>

    </section>
  );
}

export default OrderSuccess;