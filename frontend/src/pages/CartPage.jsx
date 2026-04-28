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
            {cart.length > 0 && (
              <Link to="/" className="inline-flex items-center gap-2 text-[#E94E77] font-bold mt-4 hover:underline">
                <ArrowLeft size={18} /> Continue Shopping
              </Link>
            )}
          </div>

          {/* Right Side: Order Summary Sidebar */}
          <div className="lg:w-[400px]">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 border-b border-gray-100 pb-6 mb-6">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-800">Rs. {cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-500 font-bold uppercase text-xs">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold">Total</span>
                <span className="text-3xl font-black text-[#7A231E]">Rs. {cartTotal}</span>
              </div>

              <button className="w-full bg-[#E94E77] text-white py-5 rounded-2xl font-bold text-lg hover:bg-rose-600 transition-all shadow-lg shadow-rose-100">
                Proceed to Checkout
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-6 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
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