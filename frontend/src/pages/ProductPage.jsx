import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Search, Star, ShoppingCart, Check } from 'lucide-react';

export default function ProductPage({ products }) {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  
  // FIX 1: Change default state to 'All' to match your App.jsx
  const [selectedCategory, setSelectedCategory] = useState('All'); 
  const [addedItems, setAddedItems] = useState({});

  const categories = [
  { name: 'All', count: products.length }, 
  { 
    name: 'Cakes', 
    count: products.filter(p => p.category?.trim() === 'Cakes').length 
  },
  { 
    name: 'Donuts', 
    count: products.filter(p => p.category?.trim() === 'Donuts').length 
  },
  { 
    name: 'Pastries', 
    count: products.filter(p => p.category?.trim() === 'Pastries').length 
  },
  { 
    name: 'Ice Cream', 
    // This looks for "Ice-cream", "ice cream", or "icecream" in your DB
    count: products.filter(p => p.category?.toLowerCase().replace(/[^a-z]/g, '') === 'icecream').length 
  },
  { 
    name: 'Cookies', 
    count: products.filter(p => p.category?.trim() === 'Cookies').length 
  },
];

// 2. Updated Filter Logic to match the Homepage
const filtered = products.filter(p => {
  const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
  
  // Normalize strings for comparison
  const productCat = p.category?.toLowerCase().replace(/[^a-z]/g, '');
  const selectedCat = selectedCategory.toLowerCase().replace(/[^a-z]/g, '');
  
  const matchesCat = selectedCategory === 'All' || productCat === selectedCat;
  
  return matchesSearch && matchesCat;
});

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#432818]">Our Products</h1>
          <p className="text-gray-500 text-sm mt-1">Discover our handcrafted bakery collection</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <aside className="lg:w-64 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
              <h3 className="font-bold text-gray-800 mb-4 text-xs uppercase tracking-widest">Categories</h3>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li 
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex justify-between items-center px-4 py-3 rounded-xl cursor-pointer transition-all text-sm ${
                      selectedCategory === cat.name 
                      ? 'bg-rose-50 text-[#E94E77] font-bold' 
                      : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-50">{cat.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex justify-between items-center mb-6 px-2">
              <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">
                Showing <span className="text-gray-900">{filtered.length} products</span>
              </p>
            </div>

            {/* FIX 3: Added a "No products found" message so the screen isn't just blank */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filtered.map((item) => (
                  <div key={item.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative">
                    <div className="h-64 overflow-hidden bg-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    
                    <div className="p-7">
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{item.category}</span>
                      <h3 className="text-lg font-bold text-gray-800 mt-1 mb-2 leading-tight">{item.name}</h3>
                      
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xl font-black text-gray-900">Rs. {item.price}</span>
                        <button 
                          onClick={() => handleAddToCart(item)}
                          className={`p-3 rounded-2xl transition-all duration-300 shadow-lg ${
                            addedItems[item.id] ? 'bg-[#00D084] text-white scale-110' : 'bg-[#432818] text-white hover:bg-black'
                          }`}
                        >
                          {addedItems[item.id] ? <Check size={20} /> : <ShoppingCart size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                <p className="text-gray-400">No products found. Check your backend connection!</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}