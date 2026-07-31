import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function ProductPage({ products }) {
  const navigate = useNavigate(); 
  const location = useLocation();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const initialCategory = location.state?.selectedCategory || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory); 

  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
  }, [location.state]);

  const categories = [
    { name: 'All', count: products.length }, 
    { name: 'Cakes', count: products.filter(p => p.category_id === 1).length },
    { name: 'Donuts', count: products.filter(p => p.category_id === 2).length },
    { name: 'Pastries', count: products.filter(p => p.category_id === 3).length },
    { name: 'Ice Cream', count: products.filter(p => p.category_id === 4).length },
    { name: 'Cookies', count: products.filter(p => p.category_id === 5).length },
  ];

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = selectedCategory === 'All' || 
      (selectedCategory === 'Cakes' && p.category_id === 1) ||
      (selectedCategory === 'Donuts' && p.category_id === 2) ||
      (selectedCategory === 'Pastries' && p.category_id === 3) ||
      (selectedCategory === 'Ice Cream' && p.category_id === 4) ||
      (selectedCategory === 'Cookies' && p.category_id === 5);
    
    return matchesSearch && matchesCat;
  });

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

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filtered.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                <p className="text-gray-400">No products found in this category.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}