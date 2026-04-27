 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import wavyBG from './assets/landing-bg.png'; 
import ProductCard from './components/ProductCard';
import CategoryBar from './components/CategoryBar';
import Featured from './components/Featured';
import ServiceFeatures from './components/ServiceFeatures'

import cake1 from './assets/choco-cake.png';
import cake2 from './assets/red-velvet.png';
import cake3 from './assets/blueberry.png';
import pastry1 from './assets/strawberry pastry.png';
import pastry2 from './assets/blackforest.png';
import pastry3 from './assets/pineapple.png';
import donut1 from './assets/glazed donut.png';
import donut2 from './assets/chocolate sprinkles.png';
import donut3 from './assets/boston.png';
import icecream1 from './assets/vanilla.png';
import icecream2 from './assets/chocolate.png';
import icecream3 from './assets/mango-sorbet.png';
import cookies1 from './assets/choco cookies.png';
import cookies2 from './assets/oatmeal.png';
import cookies3 from './assets/peanut.png';



function App() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  const imageLib = {
    'Classic Chocolate Cake': cake1,
    'Red Velvet Dream': cake2,
    'Blueberry Cheesecake': cake3,

    'Strawberry Pastry': pastry1,
    'Black Forest Pastry': pastry2,
    'Pineapple Delight': pastry3,

    'Glazed Classic Donut': donut1,
    'Chocolate Sprinkles': donut2,
    'Boston Cream': donut3,

    'Vanilla Bean Scoop': icecream1,
    'Belgian Chocolate': icecream2,
    'Mango Sorbet': icecream3,

    'Double Choco Chip': cookies1,
    'Oatmeal Raisin': cookies2,
    'Peanut Butter Crunch': cookies3,

  };

  useEffect(() => {
    axios.get('http://localhost:8800/api/products')
  .then(res => {
        // 3. Attach the local image to the database item
        const dataWithImages = res.data.map(item => ({
          ...item,
          image: imageLib[item.name] || 'https://via.placeholder.com/300' 
        }));
        setProducts(dataWithImages);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    // STEP 1: Main container - Remove image and set min-h-screen
    <div className="min-h-screen font-sans bg-gray-50">
      
      {/* SECTION 1: Top Area - Pinks & Wavy BG */}
      <div 
        className="w-full"
        style={{ 
          backgroundImage: `url(${wavyBG})`, 
          backgroundSize: 'cover', 
          backgroundAttachment: 'fixed' // This creates the effect you liked!
        }}
      >
        <Navbar />
        <Hero />
      </div>

      {/* SECTION 2: The Menu - Solid White Background */}
      {/* STEP 2: Explicitly set this entire section to a solid white bg */}
      <section className="bg-white py-24 w-full shadow-inner">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-5xl font-black text-gray-900">Our Menu</h2>
            <div className="h-1.5 w-24 bg-[#7A231E] mt-4 rounded-full"></div>
          </div>

          <CategoryBar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: The Footer */}
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
      <p className="text-pink-100/60">Inaruwa, Nepal<br />Open: 7:00 AM - 8:00 PM</p>
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