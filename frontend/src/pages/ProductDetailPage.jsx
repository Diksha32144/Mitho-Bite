import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductReviews from '../components/ProductReviews';

export default function ProductDetailPage({ imageLib }) {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/products/${id}`);
        const processedProduct = {
          ...res.data,
          image: imageLib[res.data.name] || 'https://via.placeholder.com/400'
        };
        setProduct(processedProduct);
      } catch (err) {
        console.error("Error loading specific product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, imageLib]);

  if (loading) return <div className="text-center p-20 font-bold text-gray-500">Loading Mitho Bite Special...</div>;
  if (!product) return <div className="text-center p-20 font-bold text-red-500">Product not found.</div>;

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left: Image & Back Button */}
        <div className="space-y-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl transition-all text-xs"
          >
            <ArrowLeft size={16} /> Back to Catalog
          </button>
          <div className="h-[400px] rounded-[2rem] overflow-hidden bg-rose-50/20 border border-gray-100 flex items-center justify-center relative">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
            />

            {/* 🌟 Stock Status Badge on Image */}
            <div className="absolute top-4 left-4">
              {product.stock_quantity === 0 ? (
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-md">
                  Out of Stock
                </span>
              ) : product.stock_quantity <= 5 ? (
                <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-md">
                  Low Stock ({product.stock_quantity} left)
                </span>
              ) : (
                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full shadow-md">
                  In Stock ({product.stock_quantity} units)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Details, Price, Quantity & Add to Cart */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#E94E77]">{product.category || 'Bakery Treats'}</span>
            <h1 className="text-4xl font-black text-[#432818] mt-1 capitalize">{product.name}</h1>
          </div>

          <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm">
            <Star size={16} fill="currentColor" /> <span>4.9 (Highly Rated Dessert)</span>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed">
            {product.description || "Freshly baked by our expert confectioners using premium culinary methods for authentic flavor profiles."}
          </p>

          <div className="border-y border-gray-100 py-4 flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-400 font-bold block uppercase">Total Cost</span>
              <span className="text-3xl font-black text-[#432818]">Rs. {product.price * quantity}</span>
            </div>
        
            {/* Quantity Selector - Disabled if Out of Stock */}
            <div className={`flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 ${product.stock_quantity === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-2 font-bold hover:bg-gray-200 transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="px-4 font-bold text-sm text-gray-700 select-none">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                className="px-3 py-2 font-bold hover:bg-gray-200 transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button - Disabled when Out of Stock */}
          <button 
            onClick={() => {
              if (product.stock_quantity > 0) {
                addToCart({ ...product, quantity });
                navigate('/cart');
              }
            }}
            disabled={product.stock_quantity === 0}
            className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all ${
              product.stock_quantity === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                : 'bg-[#432818] hover:bg-black text-white transform hover:scale-[1.01] cursor-pointer'
            }`}
          >
            <ShoppingCart size={18} />
            <span>{product.stock_quantity === 0 ? 'Out of Stock' : 'Add Items & Go to Cart'}</span>
          </button>
        </div>
      </div>
      
      <ProductReviews productId={id} />
    </div>
  );
}