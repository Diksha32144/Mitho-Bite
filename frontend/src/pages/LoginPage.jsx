import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8800/api/auth/login', formData);
      if (res.data.success) {
 
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
     
        if (res.data.user?.role === 'admin') {
          navigate('/admin'); 
        } else {
          navigate('/');
        }
        window.location.reload(); 
      }
    } catch (err) {

      const serverError = err.response?.data?.message || err.response?.data?.error || 'Authentication server down.';
      setError(serverError);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-center text-gray-900 italic mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Log in to order your favorite treats</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 font-semibold text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#7A231E] transition-all bg-gray-50"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">Password</label>
            <input 
              type="password" 
              required
              value={formData.password}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#7A231E] transition-all bg-gray-50"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-[#E94E77] hover:bg-pink-600 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 mt-2">
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account yet? <Link to="/register" className="text-[#7A231E] font-bold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}