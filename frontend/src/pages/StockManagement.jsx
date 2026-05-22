import React, { useState, useEffect } from 'react';

export default function StockManagement() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, lowStockItems: 0 });

  const loadStockData = () => {
    // Get all items to view counts
    fetch('http://localhost:8800/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));

    // Get counter statistics cards summary
    fetch('http://localhost:8800/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  };

  useEffect(() => {
    loadStockData();
  }, []);

  // ⚡ QUICK ADJUST INVENTORY VALUE COUNTS
  const adjustStock = (product, offset) => {
    const newQuantity = Math.max(0, (product.stock_quantity || 0) + offset);
    
    fetch(`http://localhost:8800/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category_id: product.category_id,
        stock_quantity: newQuantity
      })
    })
    .then(res => res.json())
    .then(() => loadStockData());
  };