import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],   // list of all products
  product: null,  // single product detail
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Set all products
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    // Set single product detail
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    // Add a new product
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    // Update a product
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p._id === action.payload._id);
      if (index !== -1) state.products[index] = action.payload;
      if (state.product && state.product._id === action.payload._id) state.product = action.payload;
    },
    // Delete a product
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p._id !== action.payload);
      if (state.product && state.product._id === action.payload) state.product = null;
    },
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
    },
    // Clear single product (e.g., when leaving product detail page)
    clearProduct: (state) => {
      state.product = null;
    },
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
} = productSlice.actions;

export default productSlice.reducer;
