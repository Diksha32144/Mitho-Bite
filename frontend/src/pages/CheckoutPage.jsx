import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { User, MapPin, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  // Destructuring cartTotal instead of totalPrice to match your CartContext
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    zip: '',
    paymentMethod: 'Cash on Delivery'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();

    // Mapping items to match the order_items table structure
    const itemData = cart.map(item => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price || 0
    }));

    const orderData = {
      user_id: 1,
      total_amount: cartTotal || 0, // Sending cartTotal to backend
      payment_method: formData.paymentMethod,
      delivery_address: `${formData.street}, ${formData.city}, ${formData.zip}`,
      items: itemData
    };

    console.log("📤 Sending Order Data:", orderData);

    try {
      const res = await axios.post('http://localhost:8800/api/checkout', orderData);
      alert("✅ Order Placed Successfully!");
      clearCart();
      navigate('/');
    } catch (err) {
      console.error("❌ Checkout Error:", err.response?.data);
      alert(err.response?.data?.error || "Error placing order.");
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-[#432818] mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Contact Information */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6 text-[#E94E77]">
                <User size={20} />
                <h2 className="text-lg font-bold text-gray-800">Contact Information</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input name="firstName" value={formData.firstName} onChange={handleInputChange} className="bg-gray-50 p-3 rounded-lg text-sm outline-none focus:ring-1 focus:ring-pink-300" placeholder="First Name" />
                <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="bg-gray-50 p-3 rounded-lg text-sm outline-none focus:ring-1 focus:ring-pink-300" placeholder="Last Name" />
                <input name="email" value={formData.email} onChange={handleInputChange} className="bg-gray-50 p-3 rounded-lg text-sm outline-none focus:ring-1 focus:ring-pink-300" placeholder="Email" />
                <input name="phone" value={formData.phone} onChange={handleInputChange} className="bg-gray-50 p-3 rounded-lg text-sm outline-none focus:ring-1 focus:ring-pink-300" placeholder="Phone" />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6 text-[#E94E77]">
                <MapPin size={20} />
                <h2 className="text-lg font-bold text-gray-800">Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <input name="street" value={formData.street} onChange={handleInputChange} className="w-full bg-gray-50 p-3 rounded-lg text-sm outline-none focus:ring-1 focus:ring-pink-300" placeholder="Street Address" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="city" value={formData.city} onChange={handleInputChange} className="bg-gray-50 p-3 rounded-lg text-sm outline-none focus:ring-1 focus:ring-pink-300" placeholder="City" />
                  <input name="zip" value={formData.zip} onChange={handleInputChange} className="bg-gray-50 p-3 rounded-lg text-sm outline-none focus:ring-1 focus:ring-pink-300" placeholder="ZIP Code" />
                </div>
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-700">Rs. {item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xl font-black text-[#432818] pt-4 border-t">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>Rs. {cartTotal || 0}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={cart.length === 0}
                className={`w-full font-bold py-4 rounded-xl mt-8 flex items-center justify-center gap-2 transition-all shadow-lg ${
                  cart.length === 0 
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-[#E94E77] hover:bg-[#d43d65] text-white shadow-pink-100"
                }`}
              >
                ✅ Place Order
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;