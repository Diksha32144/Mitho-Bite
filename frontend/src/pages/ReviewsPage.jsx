import React, { useState, useEffect } from 'react';
import { Star, Quote, Send, X, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ReviewsPage() {
  const [reviewsData, setReviewsData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({ rating: 5, comment: '' });
  const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  // 🔄 FETCH ALL REVIEWS FROM BACKEND
  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://localhost:8800/api/reviews');
      setReviewsData(res.data);
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 📝 HANDLE REVIEW SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("Please sign in to drop your feedback!");
    if (!formData.comment.trim()) return alert("Review field cannot be empty.");

    setLoading(true);
    try {
      await axios.post('http://localhost:8800/api/reviews', {
        user_id: currentUser.id,
        rating: formData.rating,
        comment: formData.comment
      });

      setFormData({ rating: 5, comment: '' });
      setShowForm(false);
      fetchReviews(); // Refresh list dynamically!
    } catch (err) {
      alert("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format SQL dates elegantly
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-32 pb-24 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-[#432818] italic">What Our Customers Say</h1>
          <div className="h-1.5 w-20 bg-[#E94E77] mx-auto mt-4 rounded-full"></div>
          <p className="text-gray-500 mt-6 max-w-2xl mx-auto">
            We take pride in every bite. Here are some of the sweet words shared by our wonderful community.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
            <h4 className="text-4xl font-black text-[#E94E77]">4.9</h4>
            <div className="flex justify-center gap-1 my-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Average Rating</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
            <h4 className="text-4xl font-black text-[#432818]">1.2k+</h4>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mt-4">Happy Customers</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
            <h4 className="text-4xl font-black text-[#00D084]">100%</h4>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mt-4">Freshness Guaranteed</p>
          </div>
        </div>

        {/* --- DYNAMIC FORM MODAL --- */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 relative animate-in fade-in zoom-in duration-300 shadow-2xl">
              <button 
                onClick={() => setShowForm(false)} 
                className="absolute top-8 right-8 text-gray-400 hover:text-[#E94E77] transition-colors"
              >
                <X size={28} />
              </button>
              <h2 className="text-2xl font-black text-[#432818] mb-2">Share Your Experience</h2>
              <p className="text-sm text-gray-400 mb-6">Posting publicly as <span className="font-bold text-[#E94E77]">{currentUser?.full_name}</span></p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <select 
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none cursor-pointer text-gray-700 font-medium"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                >
                  <option value="5">5 Stars - Excellent</option>
                  <option value="4">4 Stars - Very Good</option>
                  <option value="3">3 Stars - Good</option>
                  <option value="2">2 Stars - Fair</option>
                  <option value="1">1 Star - Poor</option>
                </select>
                <textarea 
                  required
                  placeholder="How was your treat?"
                  rows="4"
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-rose-200 outline-none resize-none text-gray-700 font-medium"
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                ></textarea>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#E94E77] disabled:bg-gray-400 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#d43d66] transition-all shadow-lg active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <>Submit Review <Send size={18} /></>}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Review Grid Output */}
        {fetching ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#E94E77] w-10 h-10" /></div>
        ) : reviewsData.length === 0 ? (
          <p className="text-center text-gray-400 italic">No community feedback reviews stored yet. Be the first!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviewsData.map((rev) => (
              <div key={rev.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <Quote className="absolute top-6 right-8 text-rose-50 group-hover:text-rose-100 transition-colors" size={40} />
                  
                  <div className="flex items-center gap-4 mb-6">
                    {/* Fixed dynamic initial circle fallback to preserve profile grid seamlessly */}
                    <div className="w-12 h-12 rounded-full border-2 border-rose-100 bg-rose-50 flex items-center justify-center font-bold text-[#E94E77]">
                      {rev.name ? rev.name.charAt(0).toUpperCase() : 'M'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 leading-none">{rev.name}</h4>
                      <span className="text-[10px] text-gray-400 uppercase tracking-tighter">{formatDate(rev.date)}</span>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action Container */}
        <div className="mt-20 relative z-20">
          <div className="bg-[#7A231E] rounded-[3rem] p-12 text-center text-white shadow-2xl overflow-hidden relative">
            {/* Added relative z-10 below to pull actionable container content safely above ambient glow layer */}
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Loved our treats?</h2>
              <p className="text-rose-200 mb-8 max-w-lg mx-auto">Share your experience and get a 10% discount coupon for your next order!</p>
              <button 
                type="button"
                onClick={() => {
                  if (!currentUser) return alert("Please login first to write a review!");
                  setShowForm(true);
                }}
                className="bg-[#E94E77] hover:bg-white hover:text-[#E94E77] text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                Write a Review
              </button>
            </div>
            {/* Ambient background decoration circle layer */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl z-0"></div>
          </div>
        </div>

      </div>
    </div>
  );
}