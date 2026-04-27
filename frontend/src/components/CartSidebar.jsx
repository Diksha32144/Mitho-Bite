import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartSidebar({ isOpen, setIsOpen }) {
  const { cart, removeFromCart, addToCart, cartTotal } = useCart();

  return (
    <>
      {/* Dark Overlay when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Sidebar Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[60] shadow-2xl transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="p-6 border-b flex justify-between items-center bg-[#FDF8F5]">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Your Basket</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 italic">Your basket is empty!</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center border-b border-gray-50 pb-6">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-2xl shadow-sm" />
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                    <p className="text-[#7A231E] font-black">Rs. {item.price}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <button className="p-1 bg-gray-100 rounded-lg hover:bg-pink-100 transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="p-1 bg-gray-100 rounded-lg hover:bg-pink-100 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer / Total Area */}
          <div className="p-8 border-t bg-gray-50 space-y-4">
            <div className="flex justify-between items-center text-xl font-black">
              <span>Total</span>
              <span className="text-[#7A231E]">Rs. {cartTotal}</span>
            </div>
            <button className="w-full bg-[#432818] text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-black transition-all shadow-xl shadow-brown-100">
              Checkout Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}