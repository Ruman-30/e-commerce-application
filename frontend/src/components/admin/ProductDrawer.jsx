import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ProductDrawer({ product, onClose, onEdit, onDelete }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (product) setIsVisible(true);
  }, [product]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 400); // wait for exit animation
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Background overlay with blur */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-lg z-40"
            onClick={handleClose}
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 80 }}
          className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl z-50 p-6 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <button onClick={handleClose} className="text-slate-500">
                Close
              </button>
            </div>

            {/* Images */}
            <div className="flex gap-2 overflow-x-auto mb-4">
              {product.images?.length > 0 ? (
                product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={typeof img === "string" ? img : URL.createObjectURL(img)}
                    alt={`Product ${idx}`}
                    className="h-24 w-24 object-cover rounded"
                  />
                ))
              ) : (
                <div className="h-24 w-24 bg-slate-100 flex items-center justify-center text-slate-400">
                  No Image
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div>
                <strong>Description:</strong> {product.description || "-"}
              </div>
              <div>
                <strong>Price:</strong> ₹{product.price}
              </div>
              <div>
                <strong>Stock:</strong> {product.stock}
              </div>
              <div>
                <strong>Category:</strong> {product.category || "-"}
              </div>
              <div>
                <strong>Subcategory:</strong> {product.subCategory || "-"}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onEdit(product);
                  handleClose();
                }}
                className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                Update
              </button>
              <button
                onClick={() => onDelete(product._id)}
                className="flex-1 bg-red-50 text-red-600 py-2 rounded hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
