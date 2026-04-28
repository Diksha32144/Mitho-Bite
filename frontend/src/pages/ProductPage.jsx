import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Search, Star, ShoppingCart, Check } from 'lucide-react'; // Added Check icon

export default function ProductPage({ products }) {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [addedItems, setAddedItems] = useState({}); // State to track which items show the tick

  const categories = [
    { name: 'All Products', count: products.length },
    { 
      name: 'Cakes', 
      count: products.filter(p => p.category?.toLowerCase().trim() === 'cakes').length 
    },
    { 
      name: 'Donuts', 
      count: products.filter(p => p.category?.toLowerCase().trim() === 'donuts').length 
    },
    { 
      name: 'Pastries', 
      count: products.filter(p => p.category?.toLowerCase().trim() === 'pastries').length 
    },
    { 
      name: 'Ice Cream', 
      count: products.filter(p => {
        const cat = p.category?.toLowerCase().replace(/[^a-z]/g, ''); 
        return cat === 'icecream';
      }).length 
    },
    { 
      name: 'Cookies', 
      count: products.filter(p => p.category?.toLowerCase().trim() === 'cookies').length 
    },
  ];

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const productCat = p.category?.toLowerCase().replace(/[^a-z]/g, '');
    const selectedCat = selectedCategory.toLowerCase().replace(/[^a-z]/g, '');
    const matchesCat = selectedCategory === 'All Products' || productCat === selectedCat;
    return matchesSearch && matchesCat;
  });

  // Function to handle the add to cart animation
  const handleAddToCart = (item) => {
    addToCart(item);
    
    // Set this specific item as "added"
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    
    // Reset back to cart icon after 2 seconds
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
          
          {/* LEFT SIDEBAR */}
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

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
               <h3 className="font-bold text-gray-800 mb-4 text-xs uppercase tracking-widest">Sort By</h3>
               <select className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-gray-700">
                 <option>Featured</option>
                 <option>Newest First</option>
                 <option>Price: Low to High</option>
                 <option>Price: High to Low</option>
               </select>
            </div>
          </aside>

          {/* RIGHT SIDE: Product Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6 px-2">
              <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">
                Showing <span className="text-gray-900">{filtered.length} products</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filtered.map((item) => (
                <div key={item.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative">
                  
                  {item.isPopular && (
                    <span className="absolute top-5 right-5 z-10 bg-[#FF4D4D] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Popular</span>
                  )}
                  {item.isNew && (
                    <span className="absolute top-5 right-5 z-10 bg-[#00D084] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">New</span>
                  )}

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
                      <span className="text-[10px] text-gray-400 ml-2">(124 reviews)</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xl font-black text-gray-900">Rs. {item.price}</span>
                        <p className="text-[10px] text-green-500 font-bold uppercase mt-0.5">In Stock</p>
                      </div>
                      
                      {/* DYNAMIC BUTTON */}
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className={`p-3 rounded-2xl transition-all duration-300 shadow-lg ${
                          addedItems[item.id] 
                            ? 'bg-[#00D084] text-white scale-110' // Green & White style
                            : 'bg-[#432818] text-white hover:bg-black' // Default style
                        }`}
                      >
                        {addedItems[item.id] ? (
                          <Check size={20} className="animate-in fade-in zoom-in duration-300" />
                        ) : (
                          <ShoppingCart size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}