import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// Import the CartProvider you just created
import { CartProvider } from './context/CartContext' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap App with the Provider to share cart data everywhere */}
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
)