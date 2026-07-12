import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { User, MapPin, CreditCard, Banknote, Loader2, CheckCircle2, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', city: '', zip: '', paymentMethod: 'COD' 
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    if (savedUser) {
      setCurrentUser(savedUser);
      
     
      const nameParts = savedUser.full_name ? savedUser.full_name.split(' ') : ['', ''];
      const first = nameParts[0] || '';
      const last = nameParts.slice(1).join(' ') || '';

     
      setFormData((prev) => ({
        ...prev,
        firstName: first,
        lastName: last,
        email: savedUser.email || '',
        phone: savedUser.phone || '',
        street: savedUser.address || '',
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty!");
    if (!currentUser) return alert("Please sign in to complete your transaction.");

    setLoading(true);


    const orderData = {
      user_id: currentUser.id, 
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

          Object.entries(fields).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value;
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
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
      alert("Error: " + (err.response?.data?.error || "Check console for details"));
    } finally {
      setLoading(false);
    }
  };

 
  if (!localStorage.getItem('user')) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen pt-36 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
          <div className="w-16 h-16 bg-pink-50 text-[#E94E77] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-black text-gray-800 italic mb-2">Authentication Required</h2>
          <p className="text-gray-500 text-sm mb-6">Please log in or register an account to place and track your food deliveries safely!</p>
          <div className="space-y-3">
            <button onClick={() => navigate('/login')} className="w-full bg-[#7A231E] hover:bg-red-900 text-white font-bold py-3 rounded-xl transition-all shadow-md">
              Sign In
            </button>
            <button onClick={() => navigate('/register')} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all">
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-28 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
        
          <div className="lg:col-span-2 space-y-6">
          
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
              <div className="flex items-center gap-3 mb-6 text-[#E94E77]">
                <User size={22} strokeWidth={2.5} />
                <h2 className="text-xl font-bold text-gray-800">Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="firstName" value={formData.firstName} placeholder="First Name" onChange={handleInputChange} className="w-full bg-[#EBF2FF] p-3 rounded-xl text-sm focus:outline-none font-medium text-gray-700" />
                <input name="lastName" value={formData.lastName} placeholder="Last Name" onChange={handleInputChange} className="w-full bg-[#EBF2FF] p-3 rounded-xl text-sm focus:outline-none font-medium text-gray-700" />
                <input name="email" value={formData.email} placeholder="Email" onChange={handleInputChange} className="w-full bg-[#EBF2FF] p-3 rounded-xl text-sm focus:outline-none font-medium text-gray-700" />
                <input name="phone" value={formData.phone} placeholder="Phone" onChange={handleInputChange} className="w-full bg-[#EBF2FF] p-3 rounded-xl text-sm focus:outline-none font-medium text-gray-700" />
              </div>
            </div>

        
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
              <div className="flex items-center gap-3 mb-6 text-[#E94E77]">
                <MapPin size={22} strokeWidth={2.5} />
                <h2 className="text-xl font-bold text-gray-800">Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <input name="street" value={formData.street} placeholder="Street Address" onChange={handleInputChange} className="w-full bg-[#EBF2FF] p-3 rounded-xl text-sm focus:outline-none font-medium text-gray-700" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="city" value={formData.city} placeholder="City" onChange={handleInputChange} className="bg-[#EBF2FF] w-full p-3 rounded-xl text-sm focus:outline-none font-medium text-gray-700" />
                  <input name="zip" value={formData.zip} placeholder="Zip Code" onChange={handleInputChange} className="bg-[#EBF2FF] w-full p-3 rounded-xl text-sm focus:outline-none font-medium text-gray-700" />
                </div>
              </div>
            </div>

            
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

        
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50 sticky top-28">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h2>
              
              
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

             
              {formData.paymentMethod === 'eSewa' && (
                <button
                  type="button"
                  onClick={() => {
                    if (cart.length === 0) return alert("Your cart is empty!");
                    if (!currentUser) return alert("Please log in first!");
                    
                    const mockPayload = {
                      status: "COMPLETE",
                      transaction_code: "MOCK-TX-" + Math.floor(100000 + Math.random() * 900000),
                      total_amount: Number(cartTotal).toFixed(2),
                      transaction_uuid: `MB-${Math.floor(1000 + Math.random() * 9000)}-${Date.now()}`,
                      product_code: "EPAYTEST",
                      signed_field_names: "total_amount,transaction_uuid,product_code"
                    };

                    const base64Token = btoa(JSON.stringify(mockPayload));
                    window.location.href = `/success?data=${base64Token}`;
                  }}
                  className="mt-3 w-full border-2 border-dashed border-amber-400 bg-amber-50/60 hover:bg-amber-50 text-amber-800 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  
                </button>
              )}

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