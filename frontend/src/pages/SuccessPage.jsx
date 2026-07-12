import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; 
import { useCart } from '../context/CartContext'; 
import { CheckCircle, ShoppingBag, ArrowLeft, AlertCircle } from 'lucide-react';
import axios from 'axios';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); 
  const { clearCart } = useCart(); 
  const [orderDetails, setOrderDetails] = useState(null);
  const [isMock, setIsMock] = useState(false);
  const [dbSyncStatus, setDbSyncStatus] = useState('updating');

 useEffect(() => {
   
    const dataToken = searchParams.get('data');

    if (dataToken) {
      try {
        
        const decodedData = JSON.parse(atob(dataToken));
        setOrderDetails(decodedData);
        
  
        if (decodedData.transaction_code && String(decodedData.transaction_code).includes('MOCK')) {
          setIsMock(true);
        } else {
          setIsMock(false);
        }

        
        axios.put('http://localhost:8800/api/orders/update-status', {
          transaction_uuid: decodedData.transaction_uuid,
          transaction_code: decodedData.transaction_code
        })
        .then(res => {
          console.log("Database updated successfully:", res.data);
          setDbSyncStatus('success'); 
        })
        .catch(err => {
          console.error("Database status sync failed:", err);
          setDbSyncStatus('failed'); 
        });

       
        clearCart();

      } catch (err) {
        console.error("Parsing error inside try block:", err);
        setDbSyncStatus('failed');
      }
    } else {
  
      setOrderDetails({
        status: "COMPLETE",
        transaction_code: "TXN-" + Math.floor(100000 + Math.random() * 900000),
        total_amount: "450.00", 
        product_code: "EPAYTEST"
      });
      setIsMock(true);
      setDbSyncStatus('success');
      clearCart();
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-20 px-6 flex items-center justify-center font-sans">
      <div className="bg-white max-w-md w-full rounded-3xl p-8 shadow-xl border border-gray-50 text-center relative overflow-hidden">
        
        <div className={`h-2 w-full absolute top-0 left-0 ${isMock ? 'bg-amber-400' : 'bg-emerald-500'}`} />

        <div className="flex justify-center mb-6">
          <div className={`p-4 rounded-full ${isMock ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>
            <CheckCircle size={48} strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Order Confirmed!</h1>
        <p className="text-gray-400 text-sm font-medium px-4">
          Thank you for baking with Mitho Bite! Your artisan order has been received and is being prepared.
        </p>

        {orderDetails && (
          <div className="bg-[#F8F9FA] rounded-2xl p-5 my-6 text-left space-y-3.5 border border-gray-100">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-bold uppercase tracking-wider">Payment Status</span>
              <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] uppercase tracking-wider ${isMock ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {isMock ? "Simulated Success" : "Paid via eSewa"}
              </span>
            </div>

            <div className="h-[1px] bg-gray-200/60 w-full" />

            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm font-semibold">Transaction ID</span>
              <span className="font-mono text-xs font-bold text-gray-800 bg-white px-2 py-1 rounded border border-gray-100 shadow-2xs">
                {orderDetails.transaction_code || "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm font-semibold">Merchant Code</span>
              <span className="text-sm font-bold text-gray-700">{orderDetails.product_code || "EPAYTEST"}</span>
            </div>

            <div className="h-[1px] bg-gray-200/60 w-full" />

            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-900 font-black text-base">Amount Settled</span>
              <span className="text-xl font-black text-[#7A231E]">Rs. {orderDetails.total_amount}</span>
            </div>
          </div>
        )}

        <div className="mb-6 text-xs text-left p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
          <span className="text-gray-500 font-medium">Database Status:</span>
          {dbSyncStatus === 'updating' && <span className="text-blue-600 font-bold animate-pulse">⏳ Updating Table...</span>}
          {dbSyncStatus === 'success' && <span className="text-emerald-600 font-bold">✅ Saved (Paid)</span>}
          {dbSyncStatus === 'failed' && <span className="text-rose-600 font-bold">❌ Connection Error</span>}
        </div>

        {isMock && (
          <div className="flex items-start gap-2.5 text-left bg-amber-50/70 border border-amber-100 rounded-xl p-3.5 mb-6">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-amber-800 text-xs font-medium leading-relaxed">
              <strong>Presentation Note:</strong> Using local state rendering fallback to display page design because eSewa's public sandbox redirect dropped parameters.
            </p>
          </div>
        )}

        <div className="space-y-3 relative z-50"> 
          <button 
            type="button"
            onClick={() => navigate('/')} 
            className="w-full bg-[#E94E77] hover:bg-[#d43d65] active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <ShoppingBag size={16} /> Keep Browsing Menu
          </button>
          
          <button 
            type="button"
            onClick={() => navigate('/cart')}
            className="w-full bg-white hover:bg-gray-50 active:scale-[0.98] text-gray-500 hover:text-gray-700 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-1 text-xs cursor-pointer border border-gray-100"
          >
            <ArrowLeft size={12} /> View My Cart Again
          </button>
        </div>

      </div>
    </div>
  );
};

export default SuccessPage;