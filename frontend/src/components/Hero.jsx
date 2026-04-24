import basketImg from '../assets/bread-basket.png';

export default function Hero() {
  return (
    <div className="relative pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Text Section */}
        <div className="space-y-8">
          <h1 className="text-2xl md:text-6xl font-black text-gray-900 leading-tight">
            Where Every <br />
            Bite Feels <br />
            <span className="text-[#7A231E]">Like Home</span>
          </h1>
          
          <p className="text-gray-700 text-lg max-w-sm font-medium leading-relaxed">
            Welcome to our bakery, where every loaf, cake, and pastry is made fresh with love and the finest ingredients.
          </p>

          <button className="bg-[#7A231E] text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-red-200/50 hover:bg-[#5c1a16] transition-all hover:scale-105 active:scale-95">
            Shop Now
          </button>
        </div>

       

      </div>
    </div>
  );
}