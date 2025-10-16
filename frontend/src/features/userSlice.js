import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,       // logged-in user info
  loading: false,   // loading state for auth actions
  error: null,      // error messages
  authChecking: true, // 👈 for showing loader on app start until auth is verified
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ✅ Set logged-in user and stop auth checking
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.error = null;
      state.authChecking = false;
    },

    // ✅ Clear user (logout or not logged in)
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
      state.authChecking = false;
    },

    // ✅ Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // ✅ Set error message
    setError: (state, action) => {
      state.error = action.payload;
    },

    // ✅ Mark auth check as finished (used after fetch)
    finishAuthCheck: (state) => {
      state.authChecking = false;
    },
  },
});

export const {
  setUser,
  clearUser,
  setLoading,
  setError,
  finishAuthCheck,
} = userSlice.actions;

export default userSlice.reducer;
