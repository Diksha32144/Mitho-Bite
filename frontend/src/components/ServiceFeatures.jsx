import { Truck, ShieldCheck, Clock, Heart } from 'lucide-react';

const features = [
  { icon: <Truck size={32} />, title: "Free Delivery", desc: "On orders over Rs. 2000" },
  { icon: <ShieldCheck size={32} />, title: "Secure Payment", desc: "100% secure checkout" },
  { icon: <Clock size={32} />, title: "Same Day", desc: "Order before 2pm" },
  { icon: <Heart size={32} />, title: "Made with Love", desc: "Fresh daily baking" },
];

export default function ServiceFeatures() {
  return (
    <div className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col items-center text-center space-y-3 group">
            <div className="text-pink-400 group-hover:text-[#7A231E] transition-colors p-4 bg-pink-50 rounded-2xl">
              {f.icon}
            </div>
            <h4 className="font-bold text-gray-800">{f.title}</h4>
            <p className="text-sm text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}