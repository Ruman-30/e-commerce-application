import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviews: [],       // array of reviews for a product
  averageRating: 0,  // average rating of the product
  reviewCount: 0,    // total number of reviews
  loading: false,    // loading state for review actions
  error: null,       // error messages
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    // Set all reviews for a product
    setReviews: (state, action) => {
      state.reviews = action.payload;
      state.reviewCount = action.payload.length;
      state.averageRating =
        action.payload.reduce((sum, r) => sum + r.rating, 0) /
        (action.payload.length || 1);
      state.error = null;
    },

    // Add a new review
    addReview: (state, action) => {
      state.reviews.push(action.payload);
      state.reviewCount += 1;
      state.averageRating =
        state.reviews.reduce((sum, r) => sum + r.rating, 0) / state.reviews.length;
    },

    // Update an existing review
    updateReview: (state, action) => {
      const index = state.reviews.findIndex(r => r._id === action.payload._id);
      if (index !== -1) state.reviews[index] = action.payload;
      state.averageRating =
        state.reviews.reduce((sum, r) => sum + r.rating, 0) / (state.reviews.length || 1);
    },

    // Delete a review
    deleteReview: (state, action) => {
      state.reviews = state.reviews.filter(r => r._id !== action.payload);
      state.reviewCount = state.reviews.length;
      state.averageRating =
        state.reviews.reduce((sum, r) => sum + r.rating, 0) / (state.reviews.length || 1);
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Clear reviews (e.g., when leaving product page)
    clearReviews: (state) => {
      state.reviews = [];
      state.averageRating = 0;
      state.reviewCount = 0;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  setReviews,
  addReview,
  updateReview,
  deleteReview,
  setLoading,
  setError,
  clearReviews,
} = reviewSlice.actions;

export default reviewSlice.reducer;
