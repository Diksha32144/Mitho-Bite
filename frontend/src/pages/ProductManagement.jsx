import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';



export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock_quantity: '', category_id: '', image: null
  });

const fetchProducts = async () => {
  try {
    const res = await fetch('http://localhost:8800/api/products');
    const data = await res.json();
    
   
    console.log("DEBUG - API Data:", data);

    if (Array.isArray(data)) {
      setProducts(data);
    } else {
      console.error("API did not return an array:", data);
      setProducts([]);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setProducts([]);
  }
};

console.log("DEBUG - Current State (products):", products);

console.log("Component rendered. Current products state:", products);


  
 useEffect(() => {
  fetchProducts();
}, []);

  const categoryCounts = React.useMemo(() => {
    const counts = { 'All': products.length, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    products.forEach(p => {
      const catId = String(p.category_id);
      if (counts.hasOwnProperty(catId)) {
        counts[catId]++;
      }
    });
    return counts;
  }, [products]);

 

  const cleanId = (id) => id;

 const handleDelete = async (id) => {
 
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const res = await fetch(`http://localhost:8800/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
           fetchProducts();
        }
      } catch (err) {
        console.error("Error deleting:", err);
      }
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock_quantity: product.stock_quantity || '',
        category_id: String(product.category_id || ''),
        image: null
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', stock_quantity: '', category_id: '', image: null });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadData = new FormData();
    uploadData.append('name', formData.name);
    uploadData.append('description', formData.description);
    uploadData.append('price', formData.price);
    uploadData.append('stock_quantity', formData.stock_quantity);
    uploadData.append('category_id', formData.category_id);
    if (formData.image) uploadData.append('image', formData.image);

    const targetId = editingProduct ? cleanId(editingProduct.id) : null;
    const url = targetId ? `http://localhost:8800/api/products/${targetId}` : 'http://localhost:8800/api/products';
    
    try {
      const response = await fetch(url, { method: targetId ? 'PUT' : 'POST', body: uploadData });
      if (response.ok) { setIsModalOpen(false); fetchProducts(); }
      else { alert("Failed to save."); }
    } catch (err) { console.error(err); }
  };

  const getCategoryName = (id) => {
    const cats = { '1': 'Cakes', '2': 'Donuts', '3': 'Pastries', '4': 'Ice Cream', '5': 'Cookies' };
    return cats[String(id)] || 'Unassigned';
  };
  
const filteredProducts = products.filter(p => {
    const nameMatch = searchTerm === '' || 
      (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
   
    const pCat = p.category_id ? String(p.category_id) : '';
    const categoryMatch = selectedCategory === 'All' || pCat === String(selectedCategory);
    
    return nameMatch && categoryMatch;
  });



  return (
    <div className="p-8 bg-[#F8F9FA] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black">Products Menu</h1>
        <button onClick={() => handleOpenModal()} className="bg-[#E94E77] text-white px-5 py-3 rounded-xl text-xs font-black uppercase">
          <Plus size={16} className="inline mr-2"/> Add Product
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 p-3 rounded-xl border border-gray-300 text-sm" />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="p-3 rounded-xl border border-gray-200 text-sm bg-white">
          <option value="All">All Categories ({categoryCounts['All']})</option>
          <option value="1">Cakes ({categoryCounts['1']})</option>
          <option value="2">Donuts ({categoryCounts['2']})</option>
          <option value="3">Pastries ({categoryCounts['3']})</option>
          <option value="4">Ice Cream ({categoryCounts['4']})</option>
          <option value="5">Cookies ({categoryCounts['5']})</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-pink-600">
            <tr className="text-[10px] font-black uppercase tracking-widest text-white">
              <th className="py-4 px-6">Image</th>
              <th className="py-4 px-6">Product Details</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Price</th>
              <th className="py-4 px-6">Stock</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {filteredProducts.map((product)=> (
              <tr key={product.id}>
                <td className="py-4 px-6">
                  <img 
  src={product.image ? `http://localhost:8800/images/${product.image}` : '/default-product.png'}
  onError={(e) => { e.target.src = '/default-product.png'; }}
  className="w-12 h-12 object-cover rounded-lg" 
  alt={product.name} 
/>
                </td>
                <td className="py-4 px-6">
                  <div className="font-black text-gray-900">{product.name}</div>
                  <div className="text-xs text-gray-400 truncate max-w-xs">{product.description}</div>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-[10px] font-black uppercase">{getCategoryName(product.category_id)}</span>
                </td>
                <td className="py-4 px-6 font-black">Rs. {Number(product.price || 0).toLocaleString()}</td>
                <td className="py-4 px-6 text-emerald-600 font-bold">{product.stock_quantity} units</td>
                <td className="py-4 px-6 text-center">
                  <button onClick={() => handleOpenModal(product)} className="text-gray-400 hover:text-blue-600 mr-3"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-rose-600"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">

            
      <button 
        onClick={() => setIsModalOpen(false)} 
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
      >
        <X size={20} />
      </button>

            <h2 className="font-black text-lg mb-4">{editingProduct ? 'Edit Item' : 'New Item'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 p-3 rounded-xl text-xs" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Price" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 p-3 rounded-xl text-xs" />
                <input type="number" placeholder="Stock" required value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})} className="w-full bg-gray-50 p-3 rounded-xl text-xs" />
              </div>
              <select required value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})} className="w-full bg-gray-50 p-3 rounded-xl text-xs">
                <option value="" disabled>Select a Category</option>
                <option value="1">Cakes</option>
                <option value="2">Donuts</option>
                <option value="3">Pastries</option>
                <option value="4">Ice Cream</option>
                <option value="5">Cookies</option>
              </select>
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 p-3 rounded-xl text-xs" />
              <input type="file" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} className="w-full text-xs" />
              <button type="submit" className="w-full bg-[#E94E77] text-white p-3 rounded-xl font-bold text-xs">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}