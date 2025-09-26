import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],       // array of cart items
  totalQuantity: 0, // total number of items
  totalPrice: 0,    // total price of all items
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item to cart
    addItem: (state, action) => {
      const item = action.payload; // { _id, name, price, quantity }
      const existingItem = state.items.find(i => i._id === item._id);

      if (existingItem) {
        existingItem.quantity += item.quantity; // increase quantity
      } else {
        state.items.push(item); // add new item
      }

      state.totalQuantity += item.quantity;
      state.totalPrice += item.price * item.quantity;
    },

    // Remove item from cart
    removeItem: (state, action) => {
      const id = action.payload; // product _id
      const existingItem = state.items.find(i => i._id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalPrice -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter(i => i._id !== id);
      }
    },

    // Update quantity of a cart item
    updateItemQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      const item = state.items.find(i => i._id === _id);

      if (item) {
        // update totals
        state.totalQuantity += quantity - item.quantity;
        state.totalPrice += (quantity - item.quantity) * item.price;
        item.quantity = quantity; // update quantity
      }
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addItem, removeItem, updateItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
