import basketImg from '../assets/bread-basket.png'; // Your basket image

export default function Hero() {
  return (
    // Removed the "bg-black/40" so the wavy background shows through
    <div className="relative pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Text */}
        <div className="space-y-8">
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-[1.1]">
            Where Every <br />
            Bite Feels <br />
            <span className="text-[#7A231E]">Like Home</span>
          </h1>
          
          <p className="text-gray-700 text-lg max-w-sm leading-relaxed font-medium">
            Welcome to our bakery, where every loaf, cake, and pastry is made fresh with love and the finest ingredients.
          </p>

          <button className="bg-[#7A231E] text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-[#5a1a16] transition-transform hover:scale-105">
            Shop Now
          </button>
        </div>

        {/* Right Side: Your Basket Image */}
        <div className="relative flex justify-center">
          <img 
            src={basketImg} 
            alt="Fresh bread basket" 
            className="w-full max-w-[600px] drop-shadow-2xl"
          />
        </div>

      </div>
    </div>
  );
}