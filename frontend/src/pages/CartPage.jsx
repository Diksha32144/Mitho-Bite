import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { cart, addToCart, decreaseQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Heading - Strong but not overwhelming */}
        <h1 className="text-3xl font-bold text-[#432818] mb-10">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Side: Cart Items */}
          <div className="flex-1 space-y-4">
            {cart.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center shadow-sm">
                <p className="text-gray-400 text-sm mb-6">Your cart is empty.</p>
                <Link to="/" className="text-[#E94E77] text-sm font-bold flex items-center justify-center gap-2">
                  <ArrowLeft size={16} /> Continue Shopping
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6 relative">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                  
                  <div className="flex-1">
                    {/* Small category tag */}
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-1">{item.category}</span>
                    <h3 className="text-lg font-bold text-gray-800 leading-tight">{item.name}</h3>
                    
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg px-2 py-1 scale-90 origin-left">
                        <button onClick={() => decreaseQuantity(item.id)} className="p-1 hover:text-rose-500"><Minus size={14} /></button>
                        <span className="px-3 font-bold text-xs">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="p-1 hover:text-green-500"><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right pr-8">
                    {/* Item price made smaller and cleaner */}
                    <p className="text-lg font-bold text-[#7A231E]">Rs. {item.price * item.quantity}</p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-5 right-5 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
            
            {cart.length > 0 && (
              <Link to="/" className="inline-flex items-center gap-2 text-[#E94E77] text-sm font-bold mt-4 hover:underline">
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            )}
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:w-[380px]">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-3 border-b border-gray-100 pb-5 mb-5">
                {/* Secondary text set to text-sm */}
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-800">Rs. {cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold text-xs">FREE</span>
                </div>
              </div>

              {/* Main Total remains prominent */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-black text-[#7A231E]">Rs. {cartTotal}</span>
              </div>

              <button className="w-full bg-[#E94E77] text-white py-4 rounded-xl font-bold text-base hover:bg-rose-600 transition-all shadow-md">
                Proceed to Checkout
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-4 text-[9px] text-gray-400 uppercase font-bold tracking-widest">
                <span className="flex items-center gap-1">🛡️ Secure</span>
                <span className="flex items-center gap-1">🚚 Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}