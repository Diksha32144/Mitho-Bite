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