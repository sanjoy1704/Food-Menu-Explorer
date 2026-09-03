function CartConfirmModal({
  currentRestaurantName,
  newRestaurantName,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      
      <div className="w-full rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-md sm:rounded-3xl">
        
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-2xl">
          🛒
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-bold text-gray-900">
          Items already in cart
        </h2>

        {/* Message */}
        <p className="mt-3 text-center text-sm leading-6 text-gray-600">
          Your cart contains items from{" "}
          <span className="font-semibold text-gray-900">
            {currentRestaurantName}
          </span>
          .
        </p>

        <p className="mt-1 text-center text-sm leading-6 text-gray-600">
          Do you want to clear your existing cart and add items from{" "}
          <span className="font-semibold text-gray-900">
            {newRestaurantName}
          </span>
          ?
        </p>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Clear Cart & Add
          </button>

        </div>
      </div>
    </div>
  );
}

export default CartConfirmModal;