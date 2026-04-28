import React, {useState} from 'react';
import { useCart } from '../context/CartContext';
import { Search, Star, ShoppingCart } from 'lucide-react';

export default function ProductPage({ products }) {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  
  const categories = [
    { name: 'All Products', count: products.length },
    { name: 'Cakes', count: products.filter(p => p.category === 'Cakes').length },
    { name: 'Donuts', count: products.filter(p => p.category === 'Donuts').length },
    { name: 'Pastries', count: products.filter(p => p.category === 'Pastries').length },
    { name: 'Ice Cream', count: products.filter(p => p.category === 'Ice Cream').length },
    { name: 'Cookies', count: products.filter(p => p.category === 'Cookies').length },
  ];

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All Products' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });
  
  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Page Title & Breadcrumb */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#432818]">Our Products</h1>
          <p className="text-gray-500 text-sm mt-1">Discover our handcrafted bakery collection</p>
        </div>
  
  
  
  
  
  
  
}