import React, {useState} from 'react';
import { useCart } from '../context/CartContext';
import { Search, Star, ShoppingCart } from 'lucide-react';

export default function ProductPage({ products }) {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
}