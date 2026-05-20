import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // 🎯 Added routing hooks
import { ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.png'; 

export default function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // 🎯 SMART MENU SCROLLER: Safely bounces back home and scrolls to #menu anchor from ANY page path
  const handleMenuNavigation = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      // If on /cart or /reviews, shift route to home first, then find the menu section anchor
      navigate('/', { replace: true });
      setTimeout(() => {
        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // If already home, simply scroll down smoothly
      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 🎯 CLEAN PATH ROUTER: Forces browser to drop lingering eSewa data parameter suffixes completely
  const handleCleanNavigate = (path) => {
    navigate(path, { replace: true });
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#7A231E] text-white z-50 shadow-md py-4 px-8 flex items-center justify-between">
      
      {/* LEFT: LOGO & BRAND */}
      <Link to="/" className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
        <span className="text-2xl font-black tracking-tight">Mitho_Bite</span>
      </Link>

      {/* CENTER: NAV LINKS */}
      <div className="hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-widest">
        {/* Uses smart anchor handler to smoothly glide down to your product deck */}
        <a 
          href="#menu" 
          onClick={handleMenuNavigation} 
          className="hover:text-pink-300 transition-colors cursor-pointer"
        >
          Home
        </a>
        <button 
          onClick={() => handleCleanNavigate('/products')} 
          className="hover:text-pink-300 transition-colors uppercase tracking-widest font-bold text-sm"
        >
          Products
        </button>
        <button 
          onClick={() => handleCleanNavigate('/reviews')} 
          className="hover:text-pink-300 transition-colors uppercase tracking-widest font-bold text-sm"
        >
          Reviews
        </button>
      </div>

      {/* RIGHT: ICONS & BUTTONS */}
      <div className="flex items-center gap-6">
        <User size={22} className="cursor-pointer hover:text-pink-300 transition-colors" />
        
        {/* Updated Cart link to strip out url transaction queries instantaneously */}
        <button 
          onClick={() => handleCleanNavigate('/cart')} 
          className="relative group block pt-1"
        >
          <ShoppingCart size={24} className="group-hover:text-pink-300 transition-colors" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#E94E77] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#7A231E]">
              {itemCount}
            </span>
          )}
        </button>

        <button className="bg-[#E94E77] hover:bg-pink-600 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95">
          Sign In
        </button>
      </div>
    </nav>
  );
}