import { useState } from "react";

export default function ProductForm({ product = null, onSubmit, onCancel }) {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price || 0);
  const [stock, setStock] = useState(product?.stock || 0);
  const [category, setCategory] = useState(product?.category || '');
  const [subCategory, setSubCategory] = useState(product?.subCategory || '');
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Prepare payload (you may need to handle images differently if uploading to server)
    const payload = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      subCategory,
      images, // this will be an array of File objects
    };

    try {
      await onSubmit(payload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-medium">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </div>

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

      <div>
        <label className="text-xs font-medium">Images</label>
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
        {images.length > 0 && (
          <div className="mt-2 text-xs text-slate-500">
            {images.map((img, i) => (
              <div key={i}>{img.name}</div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 rounded bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-3 py-2 rounded bg-indigo-600 text-white"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
