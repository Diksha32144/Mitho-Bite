import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

export default function ProductCard({ item }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.stopPropagation(); 
    if (item.stock_quantity > 0) {
      addToCart(item);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${item.id}`);
  };

  return (
    <div 
      onClick={handleCardClick} 
      className="group bg-white/70 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Image Container */}
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

          {/* 🌟 STOCK BADGE OVERLAY ON IMAGE (Optional & Eye-catching) */}
          <div className="absolute top-3 left-3">
            {item.stock_quantity === 0 ? (
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-md">
                Out of Stock
              </span>
            ) : item.stock_quantity <= 5 ? (
              <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-md">
                Low Stock ({item.stock_quantity} left)
              </span>
            ) : (
              <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full shadow-md">
                In Stock
              </span>
            )}
          </div>
        </div>
        
        {/* Product Details */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-800">{item.name}</h3>
          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Price & Action Button */}
      <div className="mt-8 flex justify-between items-center">
        <div>
          <span className="text-xs text-gray-400 block uppercase font-bold tracking-tighter">Price</span>
          <span className="text-2xl font-black text-[#7A231E]">Rs. {item.price}</span>
        </div>
        
        <button 
          onClick={handleAdd} 
          disabled={item.stock_quantity === 0}
          className={`${
            item.stock_quantity === 0 
              ? 'bg-gray-300 cursor-not-allowed shadow-none' 
              : added 
                ? 'bg-green-600 shadow-lg shadow-green-200' 
                : 'bg-[#7A231E] shadow-lg shadow-red-200 hover:scale-105 active:scale-95'
          } text-white p-4 rounded-2xl transition-all flex items-center justify-center`}
        >
          {added ? <Check size={20} /> : <ShoppingCart size={20} />}
        </button>
      </div>
    </div>
  );
}