import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  Boxes, 
  LogOut, 
  ArrowLeft, 
  Bell, 
  ChevronDown,
  Loader2,
  CircleDollarSign,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockItems: 0
  });
  const [orders, setOrders] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]); // Dynamic DB Category State Holder
  const [adminInfo, setAdminInfo] = useState({ full_name: 'Admin User', email: 'admin@gmail.com' });

  useEffect(() => {
    // 🔐 Access guard checking session storage role
    const storedSession = localStorage.getItem('user');
    if (!storedSession) {
      alert("Unauthorized entry! Please log in.");
      navigate('/login');
      return;
    }
    
    const userObj = JSON.parse(storedSession);
    if (userObj.role !== 'admin') {
      alert("Access Denied: Managers and Administrators only.");
      navigate('/');
      return;
    }
    setAdminInfo(userObj);

    // Synchronize all live database metrics endpoints concurrently
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes, revenueRes] = await Promise.all([
          axios.get('http://localhost:8800/api/admin/stats'),
          axios.get('http://localhost:8800/api/admin/orders'),
          axios.get('http://localhost:8800/api/admin/revenue-by-category') // Live DB Pipeline
        ]);
        setStats(statsRes.data);
        setOrders(ordersRes.data);
        setCategoryRevenue(revenueRes.data);
      } catch (err) {
        console.error("Dashboard fetching breakdown:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const getStatusColorStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'preparing': return 'bg-orange-50 text-orange-600 border border-orange-200';
      case 'out for delivery': return 'bg-purple-50 text-purple-600 border border-purple-200';
      case 'complete': case 'paid': return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      default: return 'bg-amber-50 text-amber-600 border border-amber-200'; // Pending
    }
  };

  // Helper system to pick bar colors dynamically for sequential items
  const getProgressBarColor = (index) => {
    const colors = ['bg-[#E94E77]', 'bg-rose-400', 'bg-amber-400', 'bg-orange-400', 'bg-yellow-400'];
    return colors[index % colors.length];
  };

  // Find out what your maximum revenue amount is to calculate perfectly relative layout widths
  const maxRevenue = categoryRevenue.length > 0 ? Math.max(...categoryRevenue.map(c => Number(c.revenue))) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <Loader2 className="animate-spin text-[#7A231E]" size={44} />
      </div>
    );
  }

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen font-sans text-[#333333] selection:bg-rose-100">
      
      {/* 1. FIXED LEFT SIDEBAR PANELS */}
      <aside className="w-64 bg-[#3d1210] flex flex-col justify-between text-white fixed h-screen z-20 shadow-xl">
        <div>
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="bg-[#E94E77] p-2 rounded-xl text-white shadow-md">
              <ShoppingBag size={22} />
            </div>
            <div>
              <h2 className="font-black text-lg leading-tight tracking-tight text-white">Mitho_Bite</h2>
              <span className="text-[10px] uppercase font-black tracking-widest text-[#E94E77]">Admin Panel</span>
            </div>
          </div>

          <nav className="p-4 space-y-2 mt-4">
            {[
              { name: 'Overview', icon: <LayoutDashboard size={18} /> },
              { name: 'Products', icon: <Boxes size={18} /> },
              { name: 'Orders', icon: <ClipboardList size={18} /> },
              { name: 'Stock', icon: <AlertTriangle size={18} /> }
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.name 
                    ? 'bg-[#E94E77] text-white shadow-lg shadow-rose-900/30' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="bg-[#E94E77] w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-white border border-white/20">
              {adminInfo.full_name?.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <h4 className="text-xs font-black text-gray-100">{adminInfo.full_name}</h4>
              <p className="text-[11px] text-gray-400 truncate font-medium">{adminInfo.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-amber-400/80 hover:bg-white/5 hover:text-amber-300 transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Store
          </button>
        </div>
      </aside>

      {/* 2. RIGHT SCROLLABLE DATA DASHBOARD CONTAINER */}
      <main className="flex-1 pl-64 min-h-screen">
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard {activeTab}</h1>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Welcome back! Here's what's happening at Mitho_Bite today.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-xl border border-gray-100">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="flex items-center gap-2 border-l border-gray-200 pl-6 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 font-black text-xs flex items-center justify-center border border-rose-100">
                {adminInfo.full_name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-black text-gray-700 group-hover:text-black transition-colors">{adminInfo.full_name?.split(' ')[0]}</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl mx-auto">
          
          {/* 📊 CONDITION A: RENDER CORE ANALYTICS OVERVIEW */}
          {activeTab === 'Overview' && (
            <>
              {/* GRID ROW A: METRICS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="bg-rose-50 text-[#E94E77] p-2.5 rounded-2xl w-fit border border-rose-100">
                      <CircleDollarSign size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                      <h3 className="text-2xl font-black text-gray-900 mt-1">Rs. {Number(stats.totalRevenue).toLocaleString()}</h3>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">+12%</span>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="bg-amber-50 text-amber-600 p-2.5 rounded-2xl w-fit border border-amber-100">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
                      <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.totalOrders}</h3>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">+8%</span>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="bg-yellow-50 text-yellow-700 p-2.5 rounded-2xl w-fit border border-yellow-100">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Orders</p>
                      <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.pendingOrders}</h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg uppercase tracking-wider border border-orange-100">Action needed</span>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="bg-red-50 text-red-600 p-2.5 rounded-2xl w-fit border border-red-100">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Low Stock Items</p>
                      <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.lowStockItems}</h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-red-700 bg-red-50 px-2.5 py-1 rounded-lg uppercase tracking-wider border border-red-100">Restock needed</span>
                </div>
              </div>

              {/* GRID ROW B: SPLIT LAYOUT COLUMNS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT SIDE: RECENT ORDERS LOG FEED */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between pb-2">
                    <h3 className="text-base font-black text-gray-900 tracking-tight">Recent Orders</h3>
                    <button onClick={() => setActiveTab('Orders')} className="text-xs font-black text-[#E94E77] hover:underline bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100/50">View all</button>
                  </div>

                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100/50 hover:border-gray-200 transition-all">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-gray-900">MB-2026-00{order.id}</span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${getStatusColorStyles(order.order_status)}`}>
                              {order.order_status || 'Pending'}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-gray-400">
                            {order.full_name} <span className="mx-1 text-gray-300">•</span> {order.payment_method}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-gray-900 block">Rs. {Number(order.total_amount).toLocaleString()}</span>
                          <span className="text-[10px] font-semibold text-gray-400">Today</span>
                        </div>
                      </div>
                    ))}
                    
                    {orders.length === 0 && (
                      <div className="text-center py-12 text-gray-400 text-xs font-bold uppercase tracking-widest">
                        No active transaction records detected inside database logs.
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE: DYNAMIC REVENUE BY CATEGORY AREA */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                  <div>
                    <h3 className="text-base font-black text-gray-900 tracking-tight">Revenue by Category</h3>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">Performance tracking statistics for this week.</p>
                  </div>

                  <div className="space-y-5 max-h-[460px] overflow-y-auto pr-1">
                    {categoryRevenue.map((item, idx) => {
                      const calculatedWidth = maxRevenue > 0 ? (Number(item.revenue) / maxRevenue) * 100 : 0;
                      
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-gray-600 truncate max-w-[150px]">{item.category}</span>
                            <span className="text-gray-900 font-black">Rs. {Number(item.revenue).toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${getProgressBarColor(idx)} transition-all duration-500`}
                              style={{ width: `${calculatedWidth}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}

                    {categoryRevenue.length === 0 && (
                      <div className="text-center py-12 text-gray-400 text-xs font-bold uppercase tracking-widest">
                        No category sales data found.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </>
          )}

