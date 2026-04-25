import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import wavyBG from './assets/landing-bg.png'; 
import ProductCard from './components/ProductCard';
import CategoryBar from './components/CategoryBar';

function App() {
  const [products, setProducts] = useState([]);
  
  // FIX: You must define these two variables here!
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    axios.get('http://localhost:8800/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  // Filter logic: This now works because activeCategory is defined above
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div 
      className="min-h-screen font-sans"
      style={{ backgroundImage: `url(${wavyBG})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' }}
    >
      <Navbar />
      <Hero />

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-5xl font-black text-gray-900">Our Menu</h2>
          <div className="h-1.5 w-24 bg-[#7A231E] mt-4 rounded-full"></div>
        </div>

        {/* This was causing the error because activeCategory wasn't defined */}
        <CategoryBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
  {filteredProducts.length > 0 ? (
    // If there ARE products, show them
    filteredProducts.map((item) => (
      <ProductCard key={item.id} item={item} />
    ))
  ) : (
    // If there ARE NO products, show this message
    <div className="col-span-full text-center py-20">
      <p className="text-gray-400 text-xl italic">No treats found in this category yet...</p>
    </div>
  )}
</div>
        
      </section>

      <footer className="bg-[#7A231E] text-white py-12 mt-20">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
    <div>
      <h3 className="text-2xl font-black mb-4">Mitho Bite</h3>
      <p className="text-pink-100/80">Bringing the sweetness of home to your doorstep every single day.</p>
    </div>
    <div>
      <h4 className="font-bold mb-4 uppercase tracking-widest text-sm">Quick Links</h4>
      <ul className="space-y-2 text-pink-100/60">
        <li><a href="#" className="hover:text-white">Home</a></li>
        <li><a href="#" className="hover:text-white">Menu</a></li>
        <li><a href="#" className="hover:text-white">Contact</a></li>
      </ul>
    </div>
    <div>
      <h4 className="font-bold mb-4 uppercase tracking-widest text-sm">Visit Us</h4>
      <p className="text-pink-100/60">Dharan, Nepal<br />Open: 7:00 AM - 8:00 PM</p>
    </div>
  </div>
  <div className="border-t border-white/10 mt-12 pt-8 text-center text-pink-100/40 text-sm">
    © 2026 Mitho Bite Bakery. All rights reserved.
  </div>
</footer>
    </div>
  );
}

export default App;