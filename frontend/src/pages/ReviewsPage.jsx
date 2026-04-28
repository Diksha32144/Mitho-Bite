import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Aarya Sharma",
    date: "April 15, 2026",
    rating: 5,
    comment: "The Belgian Chocolate cake was out of this world! So moist and not overly sweet. Perfect for my daughter's birthday.",
    avatar: "https://i.pravatar.cc/150?u=aarya"
  },
  {
    id: 2,
    name: "Rohan Gupta",
    date: "April 12, 2026",
    rating: 4,
    comment: "Fast delivery and the donuts were still warm. The Glazed Classic is definitely a must-try.",
    avatar: "https://i.pravatar.cc/150?u=rohan"
  },
  {
    id: 3,
    name: "Sita Thapa",
    date: "April 10, 2026",
    rating: 5,
    comment: "Best pastries in town. Mitho Bite has become our go-to for every weekend treat!",
    avatar: "https://i.pravatar.cc/150?u=sita"
  }
];
export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
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

        {/* Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative hover:shadow-xl transition-all duration-300">
              <Quote className="absolute top-6 right-8 text-rose-50" size={40} />
              
              <div className="flex items-center gap-4 mb-6">
                <img src={rev.avatar} alt={rev.name} className="w-12 h-12 rounded-full border-2 border-rose-100" />
                <div>
                  <h4 className="font-bold text-gray-800 leading-none">{rev.name}</h4>
                  <span className="text-[10px] text-gray-400 uppercase tracking-tighter">{rev.date}</span>
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
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-[#7A231E] rounded-[3rem] p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Loved our treats?</h2>
          <p className="text-rose-200 mb-8 max-w-lg mx-auto">Share your experience and get a 10% discount coupon for your next order!</p>
          <button className="bg-[#E94E77] hover:bg-white hover:text-[#E94E77] text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95">
            Write a Review
          </button>
        </div>

      </div>
    </div>
  );
}