export default function CategoryBar({ activeCategory, setActiveCategory }) {
  const categories = ['All', 'Cakes', 'Pastries', 'Donuts'];

  return (
    <div className="flex justify-center gap-4 mb-12">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-8 py-3 rounded-full font-bold transition-all ${
            activeCategory === cat
              ? 'bg-[#7A231E] text-white shadow-lg'
              : 'bg-white/50 text-gray-600 hover:bg-white hover:text-[#7A231E]'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}