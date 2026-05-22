import React, { useState, useEffect } from 'react';
import { Eye, ArrowRight } from 'lucide-react';

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('All Orders');

  const statusTabs = ['All Orders', 'Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  const fetchOrders = () => {
    fetch('http://localhost:8800/api/admin/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🚀 ADVANCE STATUS FUNCTION
  const advanceStatus = (id, currentStatus) => {
    const statusOrder = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    const nextIndex = statusOrder.indexOf(currentStatus) + 1;
    
    if (nextIndex > 0 && nextIndex < statusOrder.length) {
      const nextStatus = statusOrder[nextIndex];
      fetch(`http://localhost:8800/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: nextStatus })
      })
      .then(res => res.json())
      .then(() => fetchOrders());
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'All Orders') return true;
    return order.order_status?.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Orders</h1>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-pink-600 text-white shadow-sm' : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment Method</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="p-4 font-bold text-gray-700">#{order.id}</td>
                <td className="p-4">
                  <div className="font-semibold text-gray-800">{order.full_name}</div>
                  <div className="text-xs text-gray-400">{order.phone}</div>
                </td>
                <td className="p-4 font-bold text-gray-800">Rs. {order.total_amount}</td>
                <td className="p-4">
                  <span className="text-xs font-semibold block text-orange-600">{order.payment_method}</span>
                  <span className="text-[10px] uppercase font-medium">{order.payment_status}</span>
                </td>
                <td className="p-4">
                  <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                    {order.order_status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => advanceStatus(order.id, order.order_status)} className="p-1.5 border rounded hover:bg-pink-50 text-pink-600">
                      <ArrowRight size={14} />
                    </button>
                    <button className="p-1.5 border rounded hover:bg-gray-50 text-gray-500">
                      <Eye size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}