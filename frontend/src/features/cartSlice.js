import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// Fetch cart with populated products
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await api.get("/cart", { withCredentials: true });
  return res.data.items || [];
});

// Add item to cart
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (item, { dispatch }) => {
    await api.post("/cart/add", item, { withCredentials: true });
    // fetch updated cart with populated products
    const updatedCart = await dispatch(fetchCart()).unwrap();
    return updatedCart;
  }
);

// Update quantity
export const updateItemQuantity = createAsyncThunk(
  "cart/updateItemQuantity",
  async ({ productId, quantity }, { dispatch }) => {
    await api.put("/cart/update", { productId, quantity }, { withCredentials: true });
    const updatedCart = await dispatch(fetchCart()).unwrap();
    return updatedCart;
  }
);

// Remove item
  export const removeItemFromCart = createAsyncThunk(
    "cart/removeItemFromCart",
    async (productId, { dispatch }) => {
      await api.delete("/cart/remove", { data: { productId }, withCredentials: true });
      const updatedCart = await dispatch(fetchCart()).unwrap();
      return updatedCart;
    }
  );

// Clear cart
export const clearCartBackend = createAsyncThunk(
  "cart/clearCartBackend",
  async (_, { dispatch }) => {
    await api.delete("/cart/clear", { withCredentials: true });
    return [];
  }
);

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  status: "idle",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const recalcTotals = (state) => {
      state.totalQuantity = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    };

    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        recalcTotals(state);
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        recalcTotals(state);
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
        recalcTotals(state);
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
        recalcTotals(state);
      })
      .addCase(clearCartBackend.fulfilled, (state) => {
        state.items = [];
        recalcTotals(state);
      });
  },
});

export default cartSlice.reducer;
