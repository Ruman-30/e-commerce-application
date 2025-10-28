import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function ProductGrid({ products, onSelect, onEdit, onDelete }) {
  if (!products || products.length === 0)
    return (
      <p className="text-center text-slate-500 py-10 text-sm sm:text-base">
        No products found.
      </p>
    );

  return (
    <div
      className="
        grid 
        grid-cols-1            /* Mobile: 1 card */
        sm:grid-cols-2         /* iPad/tablet: 2 cards */
        lg:grid-cols-3         /* Desktop: 3 cards */
        gap-4 
        sm:gap-6
        p-0                    /* ✅ Removed all outer padding */
      "
    >
      {products.map((p) => {
        const imageUrl =
          p.images?.[0]?.url || p.images?.[0] || "/placeholder-image.png";

        return (
          <motion.div
            key={p._id}
            layout
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="
              group 
              bg-white 
              border 
              border-slate-200 
              rounded-2xl 
              shadow-sm 
              hover:shadow-md 
              overflow-hidden 
              cursor-pointer 
              flex 
              flex-col 
              transition-all
            "
            onClick={() => onSelect(p)}
          >
            {/* Product Image */}
            <div className="relative h-48 sm:h-52 md:h-56 bg-slate-100 overflow-hidden">
              <img
                src={imageUrl}
                alt={p.name}
                className="
                  h-full w-full 
                  object-cover object-top 
                  group-hover:scale-105 
                  transition-transform 
                  duration-300
                "
              />
              <span
                className="
                  absolute top-2 left-2 
                  bg-indigo-600 text-white 
                  text-[10px] sm:text-xs font-medium 
                  px-2 py-1 rounded-md
                "
              >
                {p.category}
              </span>
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-between p-3 sm:p-4">
              <div>
                <h3
                  className="
                    text-sm sm:text-base 
                    font-semibold text-slate-800 
                    line-clamp-2 mb-1
                  "
                >
                  {p.name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 mb-1">
                  {p.subCategory || ""}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Star
                    className={`h-4 w-4 ${
                      p.averageRating > 0
                        ? "text-yellow-400"
                        : "text-slate-300"
                    }`}
                    fill={p.averageRating > 0 ? "currentColor" : "none"}
                  />
                  <span className="text-xs sm:text-sm text-slate-600">
                    {p.averageRating || 0}/5
                  </span>
                </div>

                {/* Price */}
                <p className="text-base sm:text-lg font-semibold text-indigo-600">
                  ₹{p.price.toLocaleString()}
                </p>
              </div>

              {/* Buttons */}
              <div
                className="
                  mt-4 flex justify-between items-center 
                  border-t border-slate-200 pt-3
                "
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(p);
                  }}
                  className="
                    text-[11px] sm:text-xs 
                    px-3 py-1.5 rounded-lg 
                    bg-slate-100 text-slate-700 
                    hover:bg-slate-200 transition
                  "
                >
                  Edit
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(p._id);
                  }}
                  className="
                    text-[11px] sm:text-xs 
                    px-3 py-1.5 rounded-lg 
                    bg-red-50 text-red-600 
                    hover:bg-red-100 transition
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
