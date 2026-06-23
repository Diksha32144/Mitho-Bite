import React, { useState, useEffect } from 'react';

export default function CategoryBar({ activeCategory, setActiveCategory, products }) {
  // Use state to hold the counts so they can be updated dynamically
  const [counts, setCounts] = useState({});
  const categories = ['All', 'Cakes', 'Pastries', 'Donuts', 'Ice Cream', 'Cookies'];

  const getCategoryName = (id) => {
    const cats = { '1': 'Cakes', '2': 'Donuts', '3': 'Pastries', '4': 'Ice Cream', '5': 'Cookies' };
    return cats[id] || 'Unassigned';
  };

  // This useEffect ensures counts recalculate when 'products' data arrives
  useEffect(() => {
    const newCounts = { All: products.length };
    
    categories.forEach(cat => {
      if (cat !== 'All') {
        newCounts[cat] = products.filter(p => 
          getCategoryName(p.category_id)?.toLowerCase().trim() === cat.toLowerCase().trim()
        ).length;
      }
    });
    
    setCounts(newCounts);
  }, [products]); // Re-runs whenever the 'products' prop is updated

  return (
    <div className="flex justify-center gap-4 mb-12">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-8 py-3 rounded-full font-bold transition-all ${
            activeCategory === cat ? 'bg-[#7A231E] text-white' : 'bg-white/50 text-gray-600'
          }`}
        >
          {cat} ({counts[cat] || 0})
        </button>
      ))}
    </div>
  );
}