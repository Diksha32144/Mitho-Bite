import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    address: "",
    phone: ""
  });
  const [error, setError] = useState('');
  
  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8800/api/auth/register', formData); 
      if (res.data.success) {
        alert("Registration complete! Please sign in.");
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-center text-gray-900 italic mb-2">Create Account</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Join Mitho Bite today</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1 tracking-wider">Full Name *</label>
            <input 
              type="text" required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#7A231E] transition-all bg-gray-50 text-sm"
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1 tracking-wider">Email *</label>
            <input 
              type="email" required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#7A231E] transition-all bg-gray-50 text-sm"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1 tracking-wider">Password *</label>
            <input 
              type="password" required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#7A231E] transition-all bg-gray-50 text-sm"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1 tracking-wider">Address</label>
              <input 
                type="text"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#7A231E] transition-all bg-gray-50 text-sm"
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1 tracking-wider">Phone Number</label>
              <input 
                type="text"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#7A231E] transition-all bg-gray-50 text-sm"
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#7A231E] hover:bg-red-900 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 mt-2">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-[#E94E77] font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}