import React from 'react';
import { Link } from 'react-router-dom'; // 1. Important: Import Link
import { ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.png'; 

export default function Navbar() {
  const { cart } = useCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#7A231E] text-white z-50 shadow-md py-4 px-8 flex items-center justify-between">
      
      {/* LEFT: LOGO & BRAND */}
      <Link to="/" className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
        <span className="text-2xl font-black tracking-tight">Mitho_Bite</span>
      </Link>

      {/* CENTER: NAV LINKS */}
      <div className="hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-widest">
        {/* 2. Change these to <Link to="..."> */}
        <Link to="/" className="hover:text-pink-300 transition-colors">Home</Link>
        <Link to="/products" className="hover:text-pink-300 transition-colors">Products</Link>
        <Link to="/reviews" className="hover:text-pink-300 transition-colors">Reviews</Link>
      </div>

      {/* RIGHT: ICONS & BUTTONS */}
      <div className="flex items-center gap-6">
        <User size={22} className="cursor-pointer hover:text-pink-300 transition-colors" />
        
        <Link to="/cart" className="relative group">
          <ShoppingCart size={24} className="group-hover:text-pink-300 transition-colors" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#E94E77] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#7A231E]">
              {itemCount}
            </span>
          )}
        </Link>

        <button className="bg-[#E94E77] hover:bg-pink-600 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95">
          Sign In
        </button>
      </div>
    </nav>
  );
}