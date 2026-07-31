import React from 'react';
import { useNavigate } from 'react-router-dom';
import donutHero from "../assets/chocolate sprinkles.png"; 
import pastryHero from "../assets/pineapple.png"; 
import cakeHero from "../assets/red-velvet.png"; 

export default function Featured() {
  const navigate = useNavigate();

  const handleExplore = (categoryName) => {
    navigate('/products', { state: { selectedCategory: categoryName } });
  };

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-6">
      
      {/* 1. Donuts Section */}
      <div className="bg-[#FFF8F6] rounded-[2.5rem] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12 shadow-sm border border-rose-100/50">
        <div className="w-full lg:w-1/2 space-y-4 flex flex-col items-center lg:items-start order-2 lg:order-1">
          <span className="text-[#E94E77] font-bold uppercase tracking-widest text-xs">3 Products</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#432818]">Donuts</h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed text-center lg:text-left">
            Glazed, filled, and decorated donuts fresh every morning. Each item is handcrafted by our expert bakers using only the finest ingredients.
          </p>
          <button 
            onClick={() => handleExplore('Donuts')}
            className="bg-[#432818] hover:bg-black text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            Explore Donuts &rarr;
          </button>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
          <div className="w-[300px] h-[300px] md:w-[360px] md:h-[360px] rounded-[2rem] overflow-hidden shadow-md bg-white p-3 border border-gray-100">
            <img src={donutHero} alt="Donuts" className="w-full h-full object-cover rounded-[1.5rem]" />
          </div>
        </div>
      </div>

      {/* 2. Pastries Section */}
      <div className="bg-[#FFF8F6] rounded-[2.5rem] p-8 md:p-12 flex flex-col lg:flex-row-reverse items-center gap-12 shadow-sm border border-rose-100/50">
        <div className="w-full lg:w-1/2 space-y-4 flex flex-col items-center lg:items-start order-2 lg:order-1">
          <span className="text-[#E94E77] font-bold uppercase tracking-widest text-xs">3 Products</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#432818]">Pastries</h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed text-center lg:text-left">
            Croissants, danishes, eclairs and more French delights. Each item is handcrafted by our expert bakers using only the finest ingredients.
          </p>
          <button 
            onClick={() => handleExplore('Pastries')}
            className="bg-[#432818] hover:bg-black text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            Explore Pastries &rarr;
          </button>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
          <div className="w-[300px] h-[300px] md:w-[360px] md:h-[360px] rounded-[2rem] overflow-hidden shadow-md bg-white p-3 border border-gray-100">
            <img src={pastryHero} alt="Pastries" className="w-full h-full object-cover rounded-[1.5rem]" />
          </div>
        </div>
      </div>

      {/* 3. Cakes Section */}
      <div className="bg-[#FFF8F6] rounded-[2.5rem] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12 shadow-sm border border-rose-100/50">
        <div className="w-full lg:w-1/2 space-y-4 flex flex-col items-center lg:items-start order-2 lg:order-1">
          <span className="text-[#E94E77] font-bold uppercase tracking-widest text-xs">3 Products</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#432818]">Cakes</h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed text-center lg:text-left">
            Birthday cakes, celebration cakes, and everyday indulgences. Each item is handcrafted by our expert bakers using only the finest ingredients.
          </p>
          <button 
            onClick={() => handleExplore('Cakes')}
            className="bg-[#432818] hover:bg-black text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            Explore Cakes &rarr;
          </button>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
          <div className="w-[300px] h-[300px] md:w-[360px] md:h-[360px] rounded-[2rem] overflow-hidden shadow-md bg-white p-3 border border-gray-100">
            <img src={cakeHero}alt="Cakes" className="w-full h-full object-cover rounded-[1.5rem]" />
          </div>
        </div>
      </div>

    </div>
  );
}