import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  ChefHat, 
  Truck, 
  ArrowLeft, 
  Loader2,
  MapPin,
  User,
  Mail
} from 'lucide-react';

export default function OrderTracking() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 🔐 Check client identity session data
    const storedSession = localStorage.getItem('user');
    if (!storedSession) {
      alert("Please log in to track your orders.");
      navigate('/login');
      return;
    }
    const userObj = JSON.parse(storedSession);
    setCurrentUser(userObj);

    const fetchUserOrders = async () => {
  try {
    const res = await axios.get(`http://localhost:8800/api/users/${userObj.id}/orders`);
    setOrders(res.data || []);
  } catch (err) {
    console.error("Tracking connection breakdown:", err);
  } finally {
    // FIX: Call the setter function instead of the state variable itself
    setLoading(false); 
  }
};

    fetchUserOrders();
  }, [navigate]);

  // Maps order_status strings to visual pipeline steps perfectly
  const getStatusStep = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': 
        return 1;
      case 'confirmed': case 'processing': 
        return 2;
      case 'preparing': 
        return 3;
      case 'on the way': case 'out for delivery': 
        return 4;
      case 'delivered': case 'complete': case 'paid': 
        return 5;
      default: 
        return 1;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <Loader2 className="animate-spin text-[#7A231E]" size={44} />
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans text-[#333333] pb-12">
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-10 flex items-center gap-4">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-500 hover:text-black"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Track Your Orders</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Real-time delivery status updates for Mitho_Bite</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6 mt-4">
        {orders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center space-y-4 shadow-sm">
            <Package className="mx-auto text-gray-300" size={48} />
            <h3 className="text-base font-black text-gray-700">No Orders Found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">You haven't placed any orders yet.</p>
            <button 
              onClick={() => navigate('/')} 
              className="bg-[#E94E77] hover:bg-pink-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all uppercase tracking-wider"
            >
              Order Now
            </button>
          </div>
        ) : (
          orders.map((order) => {
            const currentStep = getStatusStep(order.order_status);
            const isPaid = order.payment_status?.toLowerCase() === 'paid';
            
            return (
              <div key={order.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 transition-all hover:border-gray-200">
                
                {/* TOP CARD DETAILS */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-50 pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Reference</span>
                    <h3 className="text-base font-black text-gray-900">MB-2026-00{order.id}</h3>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-400 block mb-1">Payment Status</span>
                      <span className={`text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                        isPaid 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                          : 'bg-amber-50 text-amber-600 border-amber-200'
                      }`}>
                        ● {order.payment_status || 'Unpaid'}
                      </span>
                    </div>

                    <div className="text-right space-y-0.5">
                      <span className="text-xs font-bold text-gray-400 block">Total Amount</span>
                      <span className="text-sm font-black text-gray-900">Rs. {Number(order.total_amount).toLocaleString()}</span>
                    </div>

                    <div className="text-right space-y-0.5">
                      <span className="text-xs font-bold text-gray-400 block">Payment Mode</span>
                      <span className="text-xs font-black text-[#E94E77] bg-rose-50 border border-rose-100/50 px-2.5 py-1 rounded-lg uppercase tracking-wide">
                        {order.payment_method}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 🚚 DETAILS GRID (ADDRESS, NAME, & EMAIL) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                  {/* Shipping Address Column */}
                  <div className="flex items-start gap-2.5">
                    <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Shipping To</span>
                      <p className="text-xs font-bold text-gray-700 leading-tight">{order.delivery_address}</p>
                    </div>
                  </div>

                  {/* Customer Name Column */}
                  <div className="flex items-start gap-2.5 border-t md:border-t-0 md:border-l border-gray-200/60 pt-3 md:pt-0 md:pl-4">
                    <User size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Customer Name</span>
                      <p className="text-xs font-bold text-gray-700 leading-tight">
                        {currentUser?.full_name || 'Customer'}
                      </p>
                    </div>
                  </div>

                  {/* Email Address Column */}
                  <div className="flex items-start gap-2.5 border-t md:border-t-0 md:border-l border-gray-200/60 pt-3 md:pt-0 md:pl-4">
                    <Mail size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</span>
                      <p className="text-xs font-bold text-gray-700 leading-tight break-all">
                        {currentUser?.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* VISUAL STEP PIPELINE PROGRESS BAR */}
                <div className="relative pt-4 pb-2">
                  <div className="absolute top-[38px] left-4 right-4 h-1 bg-gray-100 -z-0 rounded-full">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-700 rounded-full"
                      style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center relative z-10">
                    {[
                      { step: 1, label: 'Pending', icon: <Clock size={16} /> },
                      { step: 2, label: 'Confirmed', icon: <CheckCircle size={16} /> },
                      { step: 3, label: 'Preparing', icon: <ChefHat size={16} /> },
                      { step: 4, label: 'On The Way', icon: <Truck size={16} /> },
                      { step: 5, label: 'Delivered', icon: <Package size={16} /> }
                    ].map((node) => {
                      const isDone = currentStep >= node.step;
                      return (
                        <div key={node.step} className="flex flex-col items-center space-y-2 text-center flex-1">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                            isDone 
                              ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-100' 
                              : 'bg-white text-gray-400 border-gray-200'
                          }`}>
                            {node.icon}
                          </div>
                          <span className={`text-[10px] font-medium ${isDone ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {node.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </main>
    </div>
  );
}