// src/components/admin/ProductModal.jsx
import { AnimatePresence, motion } from "framer-motion";
import ProductForm from "./ProductForm";

export default function ProductModal({ isOpen, product, onSubmit, onCancel }) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                {product ? "Update Product" : "Add Product"}
              </h2>
              <button
                onClick={onCancel}
                className="text-gray-600 hover:text-indigo-600"
              >
                ✕
              </button>
            </div>

            <ProductForm product={product} onSubmit={onSubmit} onCancel={onCancel} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
