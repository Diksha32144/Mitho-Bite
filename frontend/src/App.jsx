import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import wavyBG from './assets/landing-bg.png'; // Make sure this file name is correct

function App() {
  return (
    <div 
      className="min-h-screen font-sans selection:bg-pink-200"
      style={{ 
        backgroundImage: `url(${wavyBG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // This keeps the waves in place while scrolling
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Navbar />
      <Hero />
    </div>
  );
}

export default App;