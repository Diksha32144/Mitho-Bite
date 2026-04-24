import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cake, ShoppingCart, Loader2 } from 'lucide-react';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Calling your Node.js backend
    axios.get('http://localhost:8800/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-orange-600 flex items-center gap-2">
          Mitho Bite <Cake size={36} />
        </h1>
        <button className="p-2 bg-white rounded-full shadow-md hover:bg-orange-100 transition">
          <ShoppingCart className="text-gray-700" />
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin text-orange-500" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map(item => (
              <div key={item.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow p-5 border border-orange-100">
                <div className="h-40 bg-orange-200 rounded-2xl mb-4 flex items-center justify-center">
                   <Cake size={60} className="text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
                <div className="mt-6 flex justify-between items-center">
                  <span className="text-xl font-black text-orange-600">Rs. {item.price}</span>
                  <button className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition">
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;