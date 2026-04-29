import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { User, MapPin, CreditCard, ChevronLeft } from 'lucide-react';

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const orderData = {
      total_amount: totalPrice,
      payment_method: formData.paymentMethod,
      delivery_address: `${formData.street}, ${formData.city}, ${formData.zip}`,
      items: cart
    };
    try {
      const res = await axios.post('http://localhost:8800/api/checkout', orderData);
      alert("Order Placed Successfully!");
      clearCart();
    } catch (err) {
      alert("Error placing order.");
    }
  };
  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-[#432818] mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SECTION: FORMS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Contact Information */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6 text-[#E94E77]">
                <User size={20} />
                <h2 className="text-lg font-bold text-gray-800">Contact Information</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                  <input name="firstName" onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm" placeholder="John" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                  <input name="lastName" onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm" placeholder="Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                  <input name="email" onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm" placeholder="john@example.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                  <input name="phone" onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm" placeholder="+977 98XXXXXXXX" />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6 text-[#E94E77]">
                <MapPin size={20} />
                <h2 className="text-lg font-bold text-gray-800">Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Street Address</label>
                  <input name="street" onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm" placeholder="123 Baker Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                    <input name="city" onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm" placeholder="Kathmandu" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">ZIP Code</label>
                    <input name="zip" onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm" placeholder="44600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6 text-[#E94E77]">
                <CreditCard size={20} />
                <h2 className="text-lg font-bold text-gray-800">Payment Method</h2>
              </div>
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'Cash on Delivery' ? 'border-[#E94E77] bg-pink-50' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#E94E77] p-2 rounded-lg text-white">📦</div>
                    <div>
                      <p className="font-bold text-sm">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay when you receive your order</p>
                    </div>
                  </div>
                  <input type="radio" name="paymentMethod" value="Cash on Delivery" checked={formData.paymentMethod === 'Cash on Delivery'} onChange={handleInputChange} className="accent-[#E94E77]" />
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'eSewa' ? 'border-[#E94E77] bg-pink-50' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg">e</div>
                    <div>
                      <p className="font-bold text-sm">eSewa <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full ml-2">Digital Wallet</span></p>
                      <p className="text-xs text-gray-500">Pay securely via eSewa — redirects to gateway</p>
                    </div>
                  </div>
                  <input type="radio" name="paymentMethod" value="eSewa" checked={formData.paymentMethod === 'eSewa'} onChange={handleInputChange} className="accent-[#E94E77]" />
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION: ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-700">Rs. {item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t pt-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-500 font-bold">Free</span>
                </div>
                <div className="flex justify-between text-xl font-black text-[#432818] pt-4 border-t mt-4">
                  <span>Total</span>
                  <span>Rs. {totalPrice}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                className="w-full bg-[#E94E77] hover:bg-[#d43d65] text-white font-bold py-4 rounded-xl mt-8 flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-100"
              >
                ✅ Place Order
              </button>
              
              <button className="w-full text-gray-400 text-xs font-bold mt-4 hover:text-[#E94E77] transition-colors">
                Back to Cart
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;