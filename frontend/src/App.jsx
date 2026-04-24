import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
// Import your new wavy background
import wavyBG from './assets/landing-bg.png'; 

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8800/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div 
      className="min-h-screen font-sans selection:bg-pink-200"
      style={{ 
        backgroundImage: `url(${wavyBG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // This keeps the waves still while you scroll
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Navbar />
      <Hero />
    </div>
  );
}

export default App;