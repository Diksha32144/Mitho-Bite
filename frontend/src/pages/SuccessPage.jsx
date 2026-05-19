import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { CheckCircle2, PackageCheck, Home, ArrowLeft, Loader2 } from 'lucide-react';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [verificationError, setVerificationError] = useState(false);
  const encodedData = searchParams.get('data');

  useEffect(() => {
    if (encodedData) {
      // Send token payload string directly to your Node server for decryption validation
      axios.post('http://localhost:8800/api/verify-esewa', { data: encodedData })
        .then(res => {
          if (res.data.success) {
            clearCart(); // Clear selection states upon validated verification return
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Backend validation verification mismatch:", err);
          // Set error flag but turn off loading so buttons render and become clickable
          setVerificationError(true);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [encodedData, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
        <Loader2 className="animate-spin text-[#E94E77] mb-4" size={40} />
        <p className="text-gray-500 font-bold tracking-tight">Verifying eSewa Payment State...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pt-28 pb-16 font-sans">
      
      {/* Centered Wide Display Wrapper Card Container */}
      <div className="bg-white rounded-[32px] shadow-sm max-w-4xl w-full border border-gray-100 p-10 md:p-14 text-center flex flex-col items-center justify-center">
        
        {/* Status Badge Icon Context Wrapper */}
        <div className="mb-6 flex items-center justify-center">
          <div className={`border-4 rounded-full p-2 flex items-center justify-center ${verificationError ? 'border-amber-500 text-amber-500' : 'border-black text-black'}`}>
            <CheckCircle2 size={40} strokeWidth={2.5} />
          </div>
        </div>

        {/* Dynamic Title Headers based on Verified API Status Response */}
        <h1 className="text-4xl font-black text-gray-950 mb-4 tracking-tight">
          {verificationError ? "Payment Awaiting Sync" : "Order Confirmed! 🎉"}
        </h1>
        
        <p className="text-gray-500 text-sm font-medium max-w-xl mx-auto leading-relaxed mb-10">
          {verificationError 
            ? "Your payment processed on eSewa, but local database logging could not sync. Our team will verify your batch transaction balance shortly."
            : "Freshness on its way. Your payment via eSewa was processed successfully. Expect a tracking link in your inbox shortly!"}
        </p>

        {/* Information Status Block Row */}
        <div className="bg-gray-50 rounded-2xl py-4 px-6 mb-10 inline-flex items-center justify-center gap-3 border border-gray-100 w-full max-w-md">
          <PackageCheck size={18} className="text-[#E94E77]" />
          <div className="text-left flex flex-col justify-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Status</span>
            <span className="text-sm font-extrabold text-gray-800 leading-none">
              {verificationError ? "Pending Database Log Sync" : "Processing Payment (Verified)"}
            </span>
          </div>
        </div>

        {/* Core Link Navigation Elements - Kept functional and active */}
        <div className="w-full max-w-md space-y-4">
          <Link 
            to="/" 
            className="w-full bg-[#E94E77] hover:bg-[#d43d65] text-white font-bold py-4 rounded-xl shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2 text-sm tracking-wide"
          >
            <Home size={16} />
            Back to Mitho Bite
          </Link>

          <Link 
            to="/cart" 
            className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors py-2"
          >
            <ArrowLeft size={14} />
            View My Cart Again
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SuccessPage;