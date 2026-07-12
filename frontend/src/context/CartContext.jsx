import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const isItemInCart = prevCart.find((item) => item.id === product.id);
      if (isItemInCart) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === id);
      if (item.quantity === 1) {
        return prevCart.filter((i) => i.id !== id);
      } else {
        return prevCart.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };


  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => {
    return sum + (Number(item.price) * item.quantity);
  }, 0);

  return (
   
    <CartContext.Provider value={{ cart, addToCart, decreaseQuantity, removeFromCart, cartTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);