import { ShoppingCart, Check } from 'lucide-react'; // Added Check for feedback
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function ProductCard({ item }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(item);
    setAdded(true);
    // Reset the button icon after 1.5 seconds
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white/70 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      
      {/* Product Image Holder */}
      <div className="h-52 bg-pink-100/50 rounded-[2rem] overflow-hidden mb-6 flex items-center justify-center relative">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <span className="text-pink-300 font-bold uppercase tracking-widest text-xs">
            Mitho Bite Special
          </span>
        )}
      </div>

      {/* Info */}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-gray-800">{item.name}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Pricing & Add Button */}
      <div className="mt-8 flex justify-between items-center">
        <div>
          <span className="text-xs text-gray-400 block uppercase font-bold tracking-tighter">Price</span>
          <span className="text-2xl font-black text-[#7A231E]">Rs. {item.price}</span>
        </div>
        
        <button 
          onClick={handleAdd}
          className={`${
            added ? 'bg-green-600' : 'bg-[#7A231E]'
          } text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-200 flex items-center justify-center`}
        >
          {added ? <Check size={20} /> : <ShoppingCart size={20} />}
        </button>
      </div>
    </div>
  );
}