import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// 🔹 Async thunk to fetch products (supports search, filter, sort, pagination)
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const {
        search = "",
        category = "",
        minPrice = "",
        maxPrice = "",
        sort = "",
        order = "asc",
        page = 1,
      } = params;

      // Build URL dynamically
      let url = `/products?search=${encodeURIComponent(search)}&page=${page}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (sort) url += `&sort=${sort}&order=${order}`;

      const res = await api.get(url);
      return { products: res.data.products || [], page };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch products");
    }
  }
);

const initialState = {
  products: [],   // list of all products
  product: null,  // single product detail
  loading: false,
  error: null,
  hasMore: true,  // for pagination / "Load More"
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Set all products manually (optional)
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    // Set single product detail
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    // Add new product
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    // Update existing product
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p._id === action.payload._id);
      if (index !== -1) state.products[index] = action.payload;
      if (state.product && state.product._id === action.payload._id)
        state.product = action.payload;
    },
    // Delete product
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p._id !== action.payload);
      if (state.product && state.product._id === action.payload) state.product = null;
    },
    // Set loading manually
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Set error manually
    setError: (state, action) => {
      state.error = action.payload;
    },
    // Clear single product (e.g. when leaving product detail)
    clearProduct: (state) => {
      state.product = null;
    },
    // Reset product list (e.g. when search/filter changes)
    resetProducts: (state) => {
      state.products = [];
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📦 Handle product fetching async
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const newProducts = action.payload.products;
        if (action.payload.page === 1) {
          state.products = newProducts;
        } else {
          state.products = [...state.products, ...newProducts];
        }
        state.hasMore = newProducts.length >= 10; // backend sends 10 per page
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const {
  setProducts,
  setProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  setLoading,
  setError,
  clearProduct,
  resetProducts,
} = productSlice.actions;

export default productSlice.reducer;
