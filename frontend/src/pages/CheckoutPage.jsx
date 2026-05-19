import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { User, MapPin, CreditCard, Banknote, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', city: '', zip: '', paymentMethod: 'COD' 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty!");

    setLoading(true);

    const orderData = {
      // Pass the numerical value; your fixed backend will convert this cleanly to .toFixed(2) for eSewa
      total_amount: Number(cartTotal), 
      payment_method: formData.paymentMethod,
      delivery_address: `${formData.street}, ${formData.city}, ${formData.zip}`,
      items: cart.map(item => ({ id: item.id, quantity: item.quantity, price: item.price }))
    };

    try {
      const response = await axios.post('http://localhost:8800/api/checkout', orderData);
      
      if (response.status === 200 || response.status === 201) {
        if (formData.paymentMethod === 'eSewa' && response.data.esewaConfig) {
          const config = response.data.esewaConfig;
          
          const form = document.createElement("form");
          form.method = "POST";
          form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

          // The dynamic key map exactly matching the clean backend object structure
          const fields = {
            amount: String(config.amount),
            tax_amount: String(config.tax_amount),
            total_amount: String(config.total_amount),
            transaction_uuid: String(config.transaction_uuid),
            product_code: String(config.product_code),
            product_service_charge: String(config.product_service_charge),
            product_delivery_charge: String(config.product_delivery_charge),
            success_url: String(config.success_url),
            failure_url: String(config.failure_url),
            signed_field_names: String(config.signed_field_names),
            signature: String(config.signature),
          };

          // Append fields as hidden input fields cleanly
          Object.entries(fields).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value;
            form.appendChild(input);
          });

          document.body.appendChild(form);
          clearCart(); 
          form.submit();
          
          // Clean up the DOM element
          document.body.removeChild(form);
          return; 
        }

        if (formData.paymentMethod === 'COD') {
          alert("✅ Order Placed Successfully!");
          clearCart(); 
          navigate('/');
        }
      }
    } catch (err) {
      console.error("Order Error:", err);
      alert("Error: " + (err.response?.data?.message || "Check console for details"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
              <div className="flex items-center gap-3 mb-6 text-[#E94E77]">
                <User size={22} strokeWidth={2.5} />
                <h2 className="text-xl font-bold text-gray-800">Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="firstName" placeholder="First Name" onChange={handleInputChange} className="w-full bg-[#EBF2FF] p-3 rounded-xl text-sm focus:outline-none" />
                <input name="lastName" placeholder="Last Name" onChange={handleInputChange} className="w-full bg-[#EBF2FF] p-3 rounded-xl text-sm focus:outline-none" />
                <input name="email" placeholder="Email" onChange={handleInputChange} className="w-full bg-[#EBF2FF] p-3 rounded-xl text-sm focus:outline-none" />
                <input name="phone" placeholder="Phone" onChange={handleInputChange} className="w-full bg-[#EBF2FF] p-3 rounded-xl text-sm focus:outline-none" />
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
              <div className="flex items-center gap-3 mb-6 text-[#E94E77]">
                <MapPin size={22} strokeWidth={2.5} />
                <h2 className="text-xl font-bold text-gray-800">Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <input name="street" placeholder="Street Address" onChange={handleInputChange} className="w-full bg-[#EBF2FF] p-3 rounded-xl text-sm focus:outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="city" placeholder="City" onChange={handleInputChange} className="bg-[#EBF2FF] w-full p-3 rounded-xl text-sm focus:outline-none" />
                  <input name="zip" placeholder="Zip Code" onChange={handleInputChange} className="bg-[#EBF2FF] w-full p-3 rounded-xl text-sm focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
              <div className="flex items-center gap-3 mb-6 text-[#E94E77]">
                <CreditCard size={22} strokeWidth={2.5} />
                <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
              </div>
              <div className="space-y-4">
                <div onClick={() => setFormData({...formData, paymentMethod: 'COD'})} className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${formData.paymentMethod === 'COD' ? "border-[#E94E77] bg-[#FFF5F7]" : "border-gray-100"}`}>
                  <div className="flex items-center gap-4">
                    <Banknote className="text-[#E94E77]" />
                    <p className="font-bold text-gray-800">Cash on Delivery</p>
                  </div>
                </div>
                <div onClick={() => setFormData({...formData, paymentMethod: 'eSewa'})} className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${formData.paymentMethod === 'eSewa' ? "border-[#E94E77] bg-[#FFF5F7]" : "border-gray-100"}`}>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-green-600">eSewa</span>
                    <p className="font-bold text-gray-800">Digital Wallet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50 sticky top-28">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h2>
              
              {/* Product List */}
              <div className="space-y-6 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-800 truncate">{item.name}</h3>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-tight">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-extrabold text-gray-700 whitespace-nowrap">Rs. {item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-100 pt-6 space-y-3">
                <div className="flex justify-between text-gray-400 text-sm font-bold">
                  <span>Subtotal</span>
                  <span>Rs. {cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-[#00A86B]">Shipping</span>
                  <span className="text-[#00A86B]">Free</span>
                </div>
                
                <div className="h-[1px] bg-gray-100 w-full my-4" />

                <div className="flex justify-between items-center">
                  <span className="text-3xl font-black text-[#2D2D2D]">Total</span>
                  <span className="text-2xl font-black text-[#2D2D2D]">Rs. {cartTotal}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder} 
                disabled={loading} 
                className={`w-full font-bold py-4 rounded-2xl mt-8 flex items-center justify-center gap-3 text-white shadow-md transition-all ${loading ? "bg-gray-400" : "bg-[#E94E77] hover:bg-[#d43d65] active:scale-[0.98]"}`}
              >
                {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={20} className="bg-white/20 rounded p-0.5" /> Place Order</>}
              </button>

              <Link to="/cart" className="block text-center mt-6 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
                Back to Cart
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;