import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Search, Plus } from 'lucide-react';

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 🔄 FETCH LIVE PRODUCTS FROM BACKEND
  const fetchProducts = () => {
    fetch('http://localhost:8800/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ❌ DELETE PRODUCT HANDLER
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      fetch(`http://localhost:8800/api/products/${id}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            fetchProducts(); // Refresh list cleanly
          } else {
            alert(data.error);
          }
        });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || String(product.category_id) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500">{filteredProducts.length} products in your catalog</p>
        </div>
        <button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="1">Cakes</option>
          <option value="2">Donuts</option>
          <option value="3">Pastries</option>
        </select>
      </div>

      {/* Products Table Container */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b">
              <th className="p-4">Product</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img src={product.image || '/placeholder-bakery.png'} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                  <div>
                    <div className="font-semibold text-gray-800">{product.name}</div>
                    <div className="text-xs text-gray-400 max-w-xs truncate">{product.description}</div>
                  </div>
                </td>
                <td className="p-4 font-semibold text-gray-700">Rs. {Number(product.price).toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    product.stock_quantity > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'
                  }`}>
                    {product.stock_quantity ?? 0} units
                  </span>
                </td>
                <td className="p-4 text-gray-500">
                  <div className="flex gap-3">
                    <button className="hover:text-pink-600 transition-colors"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(product.id)} className="hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
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