import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Clock, CheckCircle, ChefHat, Truck, ArrowLeft, 
  Loader2, MapPin, User, Mail, X 
} from 'lucide-react';

export default function OrderTracking() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedSession = localStorage.getItem('user');
    if (!storedSession) {
      alert("Please log in to track your orders.");
      navigate('/login');
      return;
    }
    const userObj = JSON.parse(storedSession);
    setCurrentUser(userObj);

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/users/${userObj.id}/orders`);
        const fetchedOrders = res.data || [];
        setOrders(fetchedOrders);

        for (const order of fetchedOrders) {
          const itemsRes = await axios.get(`http://localhost:8800/api/orders/${order.id}/items`);
          setOrderItems(prev => ({ ...prev, [order.id]: itemsRes.data }));
        }
      } catch (err) {
        console.error("Tracking connection breakdown:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleCancel = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await axios.put(`http://localhost:8800/api/orders/${orderId}/cancel`);
        window.location.reload();
      } catch (err) {
        alert(err.response?.data?.error || "Failed to cancel order.");
      }
    }
  };

  const getStatusStep = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 1;
      case 'confirmed': case 'processing': return 2;
      case 'preparing': return 3;
      case 'on the way': case 'out for delivery': return 4;
      case 'delivered': case 'complete': case 'paid': return 5;
      default: return 1;
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
      <header className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-10 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-500 hover:text-black">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Track Your Orders</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6 mt-4">
        {orders.map((order) => {
          const currentStep = getStatusStep(order.order_status);
          const items = orderItems[order.id] || [];
          
          return (
            <div key={order.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
       
              <div className="flex justify-between items-start border-b border-gray-50 pb-4">
                <div className="space-y-3">
                  <h3 className="text-base font-black text-gray-900">MB-2026-00{order.id}</h3>
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={`http://localhost:8800/images/${item.image}`} className="w-12 h-12 rounded-lg object-cover border" alt={item.name} />
                      <span className="text-xs font-bold text-gray-700">{item.name} (x{item.quantity})</span>
                    </div>
                  ))}
                </div>
                {order.order_status?.toLowerCase() === 'pending' && (
                  <button onClick={() => handleCancel(order.id)} className="flex items-center gap-1 text-xs text-red-600 font-bold bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100">
                    <X size={14} /> Cancel
                  </button>
                )}
              </div>

          
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Shipping To</span>
                    <p className="text-xs font-bold text-gray-700">{order.delivery_address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 border-l border-gray-200 pl-4">
                  <User size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Customer Name</span>
                    <p className="text-xs font-bold text-gray-700">{currentUser?.full_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 border-l border-gray-200 pl-4">
                  <Mail size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Email</span>
                    <p className="text-xs font-bold text-gray-700 break-all">{currentUser?.email}</p>
                  </div>
                </div>
              </div>

         
{order.order_status?.toLowerCase() === 'cancelled' ? (
  <div className="bg-red-50 border border-red-100 text-red-600 font-bold p-4 rounded-2xl text-center text-sm mt-4">
    This order has been cancelled by the administrator.
  </div>
) : (
  <div className="relative pt-4 pb-2">
    <div className="absolute top-[38px] left-4 right-4 h-1 bg-gray-100 rounded-full">
      <div className="h-full bg-emerald-500 transition-all duration-700 rounded-full" style={{ width: `${((currentStep - 1) / 4) * 100}%` }} />
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
          <div key={node.step} className="flex flex-col items-center space-y-2 flex-1">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${isDone ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-400 border-gray-200'}`}>
              {node.icon}
            </div>
            <span className={`text-[10px] font-medium ${isDone ? 'text-emerald-600' : 'text-gray-400'}`}>{node.label}</span>
          </div>
        );
      })}
    </div>
  </div>
)}
            </div>
          );
        })}
      </main>
    </div>
  );
}