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
  
  
  
  
  
  
  
  
}