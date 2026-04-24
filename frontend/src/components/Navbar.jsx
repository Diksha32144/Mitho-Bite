import { ShoppingCart, User, Cake } from 'lucide-react';
import logo from '../assets/logo.png'; // Make sure you have your logo

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#7A231E] shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo and Name */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Sweet Crumbs Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold text-white">Mitho_Bite</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-10 text-gray-200 font-medium">
          <a href="#" className="hover:text-rose-400 transition">Home</a>
          <a href="#" className="hover:text-rose-400 transition">Products</a>
          <a href="#" className="hover:text-rose-400 transition">Reviews</a>
        </div>

        {/* Profile and Cart */}
        <div className="flex items-center gap-6">
          <button className="text-gray-200 hover:text-rose-400 transition">
            <User size={26} />
          </button>
          <button className="relative p-1">
            <ShoppingCart size={26} className="text-white" />
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              1
            </span>
          </button>
          <button className="bg-rose-500 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-rose-600 transition">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}