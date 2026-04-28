import React from 'react';
import donutHero from "../assets/glazed donut.png"; // Remove the space before .png

export default function Featured() {
  return (
    <section className="py-20 bg-[#FDF8F5]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Content */}
        <div className="space-y-6">
          <span className="text-[#7A231E] font-bold uppercase tracking-widest text-sm">
            3 Products
          </span>
          <h2 className="text-6xl font-black text-gray-900 leading-tight">
            Donuts
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-md">
            Glazed, filled, and decorated donuts fresh every morning. Each item is 
            handcrafted by our expert bakers using only the finest ingredients. 
            Perfect for any occasion or just because you deserve a treat.
          </p>
          <button className="bg-[#432818] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-black transition-all shadow-xl">
            Explore Donuts
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Right Side: Image with Decorative Box */}
        <div className="relative">
          <div className="absolute -inset-4 bg-pink-100/50 rounded-[3rem] rotate-3"></div>
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img 
              src={donutHero} 
              alt="Delicious Donuts" 
              className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700" 
            />
          </div>
        </div>

      </div>
    </section>
  );
}