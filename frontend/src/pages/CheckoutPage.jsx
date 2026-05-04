import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { User, MapPin, CreditCard, Wallet, Banknote, Loader2 } from 'lucide-react'; // Added Loader2
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // New loading state
  const [formData, setFormData] = useState({
    street: '', city: '', zip: '', paymentMethod: 'eSewa'
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    zip: '',
    paymentMethod: 'eSewa'  
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty!");
    
    // Basic validation check
    if (!formData.street || !formData.city) {
      return alert("Please fill in your shipping address.");
    }

    setLoading(true); // Start loading

    const orderData = {
      user_id: 1, 
      total_amount: cartTotal || 0,
      payment_method: formData.paymentMethod,
      delivery_address: `${formData.street}, ${formData.city}, ${formData.zip}`,
      items: cart.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price || 0
      }))
    };

    let isSuccess = false;

    try {
      const response = await axios.post('http://localhost:8800/api/checkout', orderData);
      
      if (formData.paymentMethod === 'eSewa') {
        if (response.data?.esewaConfig) {
          handleEsewaPayment(response.data.esewaConfig);
          return; 
        } else {
          alert("eSewa is currently unavailable. Please use Cash on Delivery.");
          setLoading(false);
          return;
        }
      }

      isSuccess = true;
      alert("✅ Order Placed Successfully (Cash on Delivery)!");
      clearCart();
      navigate('/');

    } catch (err) {
      if (!isSuccess) {
        console.error("❌ Checkout Error:", err);
        const errorMsg = err.response?.data?.error || "Unable to reach server. Please try again later.";
        alert(errorMsg);
      }
    } finally {
      setLoading(false); // Stop loading regardless of outcome
    }
  };

  const handleEsewaPayment = (config) => {
    const path = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
    const form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", path);

    for (const key in config) {
      const hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", config[key]);
      form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
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
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Street Address</label>
                    <input name="street" value={formData.street} onChange={handleInputChange} className="w-full bg-[#EBF2FF] p-3 rounded-lg text-sm outline-none" placeholder="e.g. Inaruwa" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">City</label>
                    <input name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-[#EBF2FF] p-3 rounded-lg text-sm outline-none" placeholder="e.g. Inaruwa" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Zip Code</label>
                    <input name="zip" value={formData.zip} onChange={handleInputChange} className="w-full bg-[#EBF2FF] p-3 rounded-lg text-sm outline-none" placeholder="123456" />
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
                <div 
                  onClick={() => setFormData({...formData, paymentMethod: 'COD'})}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    formData.paymentMethod === 'COD' ? "border-[#E94E77] bg-white shadow-sm" : "border-gray-100 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-[#E94E77]">
                      <Banknote size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Cash on Delivery</p>
                      <p className="text-xs text-gray-400">Pay when you receive your order</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'COD' ? "border-[#E94E77]" : "border-gray-200"}`}>
                    {formData.paymentMethod === 'COD' && <div className="w-2 h-2 bg-[#E94E77] rounded-full" />}
                  </div>
                </div>

                <div 
                  onClick={() => setFormData({...formData, paymentMethod: 'eSewa'})}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    formData.paymentMethod === 'eSewa' ? "border-[#E94E77] bg-[#FFF5F7]" : "border-gray-100 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center font-bold text-sm">
                      e
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-800 text-sm">eSewa</p>
                        <span className="bg-[#D1FAE5] text-[#059669] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Digital Wallet</span>
                      </div>
                      <p className="text-xs text-gray-400">Pay securely via eSewa — redirects to gateway</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'eSewa' ? "border-[#E94E77]" : "border-gray-200"}`}>
                    {formData.paymentMethod === 'eSewa' && <div className="w-2 h-2 bg-[#E94E77] rounded-full" />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
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

              <div className="border-t pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>Rs. {cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-[#059669] font-bold">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="flex justify-between text-2xl font-black text-[#432818]">
                <span>Total</span>
                <span>Rs. {cartTotal}</span>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading} // Disable while loading
                className={`w-full font-bold py-4 rounded-xl mt-8 flex items-center justify-center gap-2 text-white shadow-lg transition-all ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#E94E77] hover:bg-[#d43d65] shadow-pink-100"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>✅ Place Order</>
                )}
              </button>
              
              <button 
                onClick={() => navigate('/cart')} 
                disabled={loading}
                className="w-full text-center text-xs font-bold text-gray-400 mt-4 hover:text-gray-600 transition-all disabled:opacity-50"
              >
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