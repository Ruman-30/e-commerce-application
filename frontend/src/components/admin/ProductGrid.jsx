
export default function ProductGrid({ products, onSelect, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p) => (
        <div
          key={p._id}
          className="p-4 bg-white rounded-lg border shadow-sm cursor-pointer"
          onClick={() => onSelect(p)}
        >
          <div className="h-40 bg-slate-100 rounded mb-3 flex items-center justify-center text-slate-400">
            <img src={p.images[0] || ""} alt={p.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium">{p.name}</div>
              <div className="text-xs text-slate-500">
                ₹{p.price} • Stock: {p.stock}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(p);
                }}
                className="px-2 py-1 rounded bg-slate-100 text-xs"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(p._id);
                }}
                className="px-2 py-1 rounded bg-red-50 text-red-600 text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
