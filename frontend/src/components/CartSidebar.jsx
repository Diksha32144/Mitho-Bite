import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartSidebar({ isOpen, setIsOpen }) {
  const { cart, removeFromCart, addToCart, cartTotal } = useCart();

  return (
    <>
      {/* Dark Overlay when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}