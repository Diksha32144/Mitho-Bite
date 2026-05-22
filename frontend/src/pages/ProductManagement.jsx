import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Search, Plus } from 'lucide-react';

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 🔄 FETCH LIVE PRODUCTS FROM BACKEND
  const fetchProducts = () => {
    fetch('http://localhost:8800/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ❌ DELETE PRODUCT HANDLER
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      fetch(`http://localhost:8800/api/products/${id}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            fetchProducts(); // Refresh list cleanly
          } else {
            alert(data.error);
          }
        });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || String(product.category_id) === selectedCategory;
    return matchesSearch && matchesCategory;
  });