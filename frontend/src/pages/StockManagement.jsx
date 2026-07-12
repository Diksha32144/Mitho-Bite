import React, { useState, useEffect } from 'react';

export default function StockManagement() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, lowStockItems: 0 });

  const loadStockData = () => {
  
    fetch('http://localhost:8800/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));

   
    fetch('http://localhost:8800/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  };

  useEffect(() => {
    loadStockData();
  }, []);

 
  const adjustStock = (product, offset) => {
    const newQuantity = Math.max(0, (product.stock_quantity || 0) + offset);
    
    fetch(`http://localhost:8800/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category_id: product.category_id,
        stock_quantity: newQuantity
      })
    })
    .then(res => res.json())
    .then(() => loadStockData());
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Stock Management</h1>
      <p className="text-sm text-gray-500 mb-6">Monitor and update product inventory levels</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase">Total Items Tracked</div>
          <div className="text-3xl font-bold text-gray-800 mt-1">{products.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-semibold text-orange-500 uppercase">Low Stock Alert Count</div>
          <div className="text-3xl font-bold text-orange-600 mt-1">{stats.lowStockItems}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-semibold text-blue-500 uppercase">Active Total Orders</div>
          <div className="text-3xl font-bold text-blue-600 mt-1">{stats.totalOrders}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-pink-600 text-white text-xs uppercase font-semibold border-b">
              <th className="p-4">Product</th>
              <th className="p-4 text-center">Count Status</th>
              <th className="p-4 text-center">Quick Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="p-4 font-semibold text-gray-800">{product.name}</td>
                <td className="p-4 text-center font-bold text-gray-700">
                  <span className={`px-3 py-1 rounded text-xs ${product.stock_quantity < 5 ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>
                    {product.stock_quantity ?? 0} Units
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center items-center gap-2">
                    <button onClick={() => adjustStock(product, -5)} className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-xs font-bold">-5</button>
                    <button onClick={() => adjustStock(product, 10)} className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-xs font-bold">+10</button>
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