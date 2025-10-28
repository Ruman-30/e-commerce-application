import { useState, useEffect } from "react";

export default function ProductForm({ product = null, onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [images, setImages] = useState([]); // for new uploads
  const [existingImages, setExistingImages] = useState([]); // for editing
  const [saving, setSaving] = useState(false);

  // Prefill form when editing a product
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || 0);
      setStock(product.stock || 0);
      setCategory(product.category || "");
      setSubCategory(product.subCategory || "");
      setExistingImages(product.images || []); // existing image URLs
    } else {
      // reset for new product
      setName("");
      setDescription("");
      setPrice(0);
      setStock(0);
      setCategory("");
      setSubCategory("");
      setImages([]);
      setExistingImages([]);
    }
  }, [product]);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Prepare FormData for file upload
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("subCategory", subCategory);

      // If editing and product already has images, include them as JSON
      if (existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      // Append new images (if any)
      images.forEach((file) => formData.append("images", file));

      // Call parent submit handler (API handled in parent)
      await onSubmit(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Product Name */}
      <div>
        <label className="text-xs font-medium">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-medium">Description</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium">Price (INR)</label>
          <input
            required
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-xs font-medium">Stock</label>
          <input
            required
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Category & Subcategory */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium">Category</label>
          <input
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-xs font-medium">SubCategory</label>
          <input
            required
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="text-xs font-medium">Images</label>
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="mt-1 block w-full border rounded px-3 py-2"
        />

        {/* Show selected new images */}
        {images.length > 0 && (
          <div className="mt-2 text-xs text-slate-500">
            {images.map((img, i) => (
              <div key={i}>{img.name}</div>
            ))}
          </div>
        )}

        {/* Show existing images when editing */}
        {existingImages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {existingImages.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="product"
                className="w-16 h-16 object-cover rounded-lg border"
              />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 rounded bg-slate-100 hover:bg-slate-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {saving ? "Saving..." : product ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
}
