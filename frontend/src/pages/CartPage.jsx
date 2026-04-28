import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function CartPage() {
  const { cart, addToCart, decreaseQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-black text-[#432818] mb-10">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Side: Cart Items */}
          <div className="flex-1 space-y-6">
            {cart.length === 0 ? (
              <div className="bg-white p-12 rounded-[2.5rem] text-center shadow-sm">
                <p className="text-gray-400 mb-6">Your cart is empty.</p>
                <Link to="/" className="text-[#E94E77] font-bold flex items-center justify-center gap-2">
                  <ArrowLeft size={18} /> Continue Shopping
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6 relative">
                  <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-2xl" />
                  
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">{item.category}</span>
                    <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-gray-200 rounded-xl px-2 py-1">
                        <button onClick={() => decreaseQuantity(item.id)} className="p-1 hover:text-rose-500"><Minus size={16} /></button>
                        <span className="px-4 font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="p-1 hover:text-green-500"><Plus size={16} /></button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black text-[#7A231E]">Rs. {item.price * item.quantity}</p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}