import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],       // all orders of the user
  order: null,      // single order details
  loading: false,   // loading state for order actions
  error: null,      // error messages
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Set all orders (e.g., fetch user orders)
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.error = null;
    },

    // Set single order detail
    setOrder: (state, action) => {
      state.order = action.payload;
      state.error = null;
    },

    // Add a new order (e.g., after checkout)
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },

    // Update an existing order (e.g., payment status, admin updates)
    updateOrder: (state, action) => {
      const index = state.orders.findIndex(o => o._id === action.payload._id);
      if (index !== -1) state.orders[index] = action.payload;
      if (state.order && state.order._id === action.payload._id) state.order = action.payload;
    },

    // Delete an order (e.g., admin or user cancel)
    deleteOrder: (state, action) => {
      state.orders = state.orders.filter(o => o._id !== action.payload);
      if (state.order && state.order._id === action.payload) state.order = null;
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error message
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Clear single order
    clearOrder: (state) => {
      state.order = null;
    },
  },
});

export const {
  setOrders,
  setOrder,
  addOrder,
  updateOrder,
  deleteOrder,
  setLoading,
  setError,
  clearOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
