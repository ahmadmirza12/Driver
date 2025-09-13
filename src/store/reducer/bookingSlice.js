
import { createSlice } from "@reduxjs/toolkit";

// Initial state with an empty bookingStatuses object to store booking IDs and their statuses
const initialState = {
  bookingStatuses: {}, // e.g., { "68c547d3686f0aa1e4a7fb46": "not-started" }
};

// Create the booking slice using Redux Toolkit
export const bookingSlice = createSlice({
  name: "booking", // Slice name for Redux store
  initialState,
  reducers: {
    // Set the status for a single booking
    setBookingStatus: (state, action) => {
      const { bookingId, status } = action.payload; // Expecting { bookingId: string, status: string }
      state.bookingStatuses[bookingId] = status; // Update status for the given bookingId
    },
    // Set statuses for multiple bookings at once
    setMultipleBookingStatuses: (state, action) => {
      state.bookingStatuses = { ...state.bookingStatuses, ...action.payload }; // Merge new statuses with existing ones
    },
    // Clear all booking statuses
    clearBookingStatuses: (state) => {
      state.bookingStatuses = {}; // Reset bookingStatuses to an empty object
    },
  },
});

// Export the actions for use in components (e.g., HomeScreen.jsx)
export const { setBookingStatus, setMultipleBookingStatuses, clearBookingStatuses } = bookingSlice.actions;

// Selectors to access booking statuses from the Redux store
export const selectBookingStatuses = (state) => state.booking.bookingStatuses; // Get all booking statuses
export const selectBookingStatus = (bookingId) => (state) => state.booking.bookingStatuses[bookingId]; // Get status for a specific booking ID

// Export the reducer for use in the Redux store configuration
export default bookingSlice.reducer;
