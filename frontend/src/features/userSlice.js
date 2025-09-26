import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,      // logged-in user info
  loading: false,  // loading state for auth actions
  error: null,     // error messages
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set logged-in user and token
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.error = null;
    },
    
    // Clear user (logout)
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error message
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
