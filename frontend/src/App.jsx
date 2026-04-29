import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Featured from './components/Featured';
import CategoryBar from './components/CategoryBar';
import ProductCard from './components/ProductCard';
import ServiceFeatures from './components/ServiceFeatures';
import CartPage from './pages/CartPage';
import ProductPage from './pages/ProductPage'; 
import ReviewsPage from './pages/ReviewsPage';

// Assets
import wavyBG from './assets/landing-bg.png'; 

// Image Imports
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
    // API CALL
    axios.get('http://localhost:8800/api/products')
      .then(res => {
        const dataWithImages = res.data.map(item => ({
          ...item,
          image: imageLib[item.name] || 'https://via.placeholder.com/300' 
        }));
        setProducts(dataWithImages);
      })
      .catch(err => console.error("Database connection error:", err));
  }, []);

  // UNIVERSAL FILTER: This cleans BOTH strings to match regardless of format
  const filteredProducts = activeCategory === 'All' || activeCategory === 'All Products'
    ? products 
    : products.filter(p => {
        // Removes hyphens, spaces, and makes lowercase (e.g., "Ice-Cream" -> "icecream")
        const dbCat = p.category?.toLowerCase().replace(/[^a-z]/g, '');
        const selectedCat = activeCategory.toLowerCase().replace(/[^a-z]/g, '');
        return dbCat === selectedCat;
      });

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <Navbar />

      <Routes>
        <Route path="/" element={
          <>
            <div 
              className="w-full"
              style={{ 
                backgroundImage: `url(${wavyBG})`, 
                backgroundSize: 'cover', 
                backgroundAttachment: 'fixed' 
              }}
            >
              <Hero />
            </div>

            <section id="menu" className="bg-white py-24 w-full shadow-inner">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center mb-16">
                  <h2 className="text-5xl font-black text-gray-900 italic">Our Menu</h2>
                  <div className="h-1.5 w-24 bg-[#7A231E] mt-4 rounded-full"></div>
                </div>

                <CategoryBar 
                  activeCategory={activeCategory} 
                  setActiveCategory={setActiveCategory} 
                />
              
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredProducts.map((item) => (
                      <ProductCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
                    <p>No products found in the "{activeCategory}" category.</p>
                  </div>
                )}
              </div>
            </section>

            <Featured />
            <ServiceFeatures />
          </>
        } />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/products" element={<ProductPage products={products} />} />
        <Route path="/reviews" element={<ReviewsPage />} />
      </Routes>

      <footer className="bg-[#432818] text-white pt-20 pb-10 mt-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-3xl font-black italic">Mitho Bite</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Freshly baked happiness delivered to your door. Artisan cakes, pastries, and treats made with love since 2018.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-pink-300">Shop</h4>
            <ul className="space-y-3 text-gray-400 text-sm cursor-pointer">
              <li onClick={() => setActiveCategory('Cakes')}>Cakes</li>
              <li onClick={() => setActiveCategory('Donuts')}>Donuts</li>
              <li onClick={() => setActiveCategory('Pastries')}>Pastries</li>
              <li onClick={() => setActiveCategory('Cookies')}>Cookies</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-pink-300">Customer Care</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>Order Tracking</li>
              <li>FAQs</li>
              <li>Shipping Info</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-sm text-pink-300">Newsletter</h4>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-[#2b1a10] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none"
              />
              <button className="bg-[#E94E77] hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;