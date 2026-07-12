import React, { useState, useEffect } from 'react';
import { Star, Send, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const fetchProductReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:8800/api/products/${productId}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error loading item reviews:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (productId) fetchProductReviews();
  }, [productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("Please sign in to share feedback!");
    if (!comment.trim()) return alert("Comment body cannot be empty!");

    setLoading(true);
    try {
      await axios.post(`http://localhost:8800/api/products/${productId}/reviews`, {
        user_id: currentUser.id,
        rating,
        comment
      });
      setComment('');
      setRating(5);
      fetchProductReviews(); 
    } catch (err) {
      alert("Failed to submit your product review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 max-w-6xl mx-auto">
      <h2 className="text-2xl font-black text-[#432818] mb-8">Taste Testimony ({reviews.length})</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
       
        <div className="lg:col-span-1">
          <h3 className="font-bold text-gray-800 text-sm mb-2">Leave an Honest Review</h3>
          <p className="text-xs text-gray-400 mb-4">How did you enjoy this bakery item?</p>
          
          <form onSubmit={handleReviewSubmit} className="space-y-3">
            <select 
              value={rating} 
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none"
            >
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐ Very Good</option>
              <option value="3">⭐⭐⭐ Good</option>
              <option value="2">⭐⭐ Fair</option>
              <option value="1">⭐ Disappointing</option>
            </select>

            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Flavor notes, textures..."
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm outline-none resize-none focus:ring-1 focus:ring-rose-200"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E94E77] hover:bg-pink-600 disabled:bg-gray-300 text-white text-xs font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <>Post Review <Send size={12} /></>}
            </button>
          </form>
        </div>

        {/* Right Feed Container */}
        <div className="lg:col-span-2 space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {fetching ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#E94E77]" /></div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 text-sm">
              No reviews written for this recipe yet.
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#432818] text-white text-xs font-bold flex items-center justify-center">
                      {rev.name ? rev.name.charAt(0).toUpperCase() : 'M'}
                    </div>
                    <span className="text-xs font-bold text-gray-700">{rev.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{new Date(rev.date).toLocaleDateString()}</span>
                </div>
                <div className="flex text-yellow-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "text-yellow-400" : "text-gray-200"} />
                  ))}
                </div>
                <p className="text-xs text-gray-600 italic">"{rev.comment}"</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}