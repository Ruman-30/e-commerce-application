import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import orderReducer from "./orderSlice";
import reviewReducer from "./reviewSlice";

const store = configureStore({
  reducer: {
    products: productReducer,   // product state
    cart: cartReducer,          // cart state
    user: userReducer,          // user/auth state
    orders: orderReducer,       // orders state
    reviews: reviewReducer,     // reviews state
  },
  devTools: process.env.NODE_ENV !== "production", // enable Redux DevTools only in dev
});

export default store;
