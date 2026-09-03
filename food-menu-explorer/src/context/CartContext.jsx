
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import CartConfirmModal from "../components/CartConfirmModal";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();

  // ==========================================
  // USER-SPECIFIC CART KEY
  // ==========================================

  const cartKey = user
    ? `cartItems_${user.id}`
    : null;

  // ==========================================
  // CART ITEMS
  // ==========================================

  const [cartItems, setCartItems] = useState([]);

  // ==========================================
  // LOAD CART WHEN USER CHANGES
  // ==========================================

  useEffect(() => {
    if (!cartKey) {
      setCartItems([]);
      return;
    }

    try {
      const savedCart = localStorage.getItem(cartKey);

      setCartItems(
        savedCart ? JSON.parse(savedCart) : []
      );
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCartItems([]);
    }
  }, [cartKey]);

  // ==========================================
  // SAVE CART
  // ==========================================

  useEffect(() => {
    if (!cartKey) {
      return;
    }

    try {
      localStorage.setItem(
        cartKey,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cartItems, cartKey]);

  // ==========================================
  // RESTAURANT CHANGE POPUP
  // ==========================================

  const [pendingCartChange, setPendingCartChange] =
    useState(null);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = (item, restaurant) => {
    // Don't allow cart usage while logged out
    if (!user) {
      return;
    }

    setCartItems((currentItems) => {
      // Different restaurant
      if (
        currentItems.length > 0 &&
        currentItems[0].restaurantId !== restaurant.id
      ) {
        setPendingCartChange({
          item,
          restaurant,
          currentRestaurantName:
            currentItems[0].restaurantName,
        });

        return currentItems;
      }

      // Existing item
      const existingItem = currentItems.find(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.restaurantId === restaurant.id
      );

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id &&
          cartItem.restaurantId === restaurant.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      // New item
      return [
        ...currentItems,
        {
          ...item,
          quantity: 1,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
        },
      ];
    });
  };

  // ==========================================
  // CONFIRM RESTAURANT CHANGE
  // ==========================================

  const confirmCartChange = () => {
    if (!pendingCartChange) {
      return;
    }

    const { item, restaurant } =
      pendingCartChange;

    setCartItems([
      {
        ...item,
        quantity: 1,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      },
    ]);

    setPendingCartChange(null);
  };

  // ==========================================
  // CANCEL RESTAURANT CHANGE
  // ==========================================

  const cancelCartChange = () => {
    setPendingCartChange(null);
  };

  // ==========================================
  // REMOVE
  // ==========================================

  const removeFromCart = (
    itemId,
    restaurantId
  ) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.id === itemId &&
            item.restaurantId === restaurantId
          )
      )
    );
  };

  // ==========================================
  // INCREASE
  // ==========================================

  const increaseQuantity = (
    itemId,
    restaurantId
  ) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId &&
        item.restaurantId === restaurantId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // ==========================================
  // DECREASE
  // ==========================================

  const decreaseQuantity = (
    itemId,
    restaurantId
  ) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === itemId &&
          item.restaurantId === restaurantId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = () => {
    setCartItems([]);
  };

  // ==========================================
  // CART COUNT
  // ==========================================

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  // ==========================================
  // CART TOTAL
  // ==========================================

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}

      {pendingCartChange && (
        <CartConfirmModal
          currentRestaurantName={
            pendingCartChange.currentRestaurantName
          }
          newRestaurantName={
            pendingCartChange.restaurant.name
          }
          onCancel={cancelCartChange}
          onConfirm={confirmCartChange}
        />
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

