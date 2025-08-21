import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  bookingStatuses: {},
}

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingStatus: (state, action) => {
      const { bookingId, status } = action.payload
      state.bookingStatuses[bookingId] = status
    },
    setMultipleBookingStatuses: (state, action) => {
      state.bookingStatuses = { ...state.bookingStatuses, ...action.payload }
    },
    clearBookingStatuses: (state) => {
      state.bookingStatuses = {}
    },
  },
})

export const { setBookingStatus, setMultipleBookingStatuses, clearBookingStatuses } = bookingSlice.actions

export const selectBookingStatuses = (state) => state.booking.bookingStatuses
export const selectBookingStatus = (bookingId) => (state) => state.booking.bookingStatuses[bookingId]

export default bookingSlice.reducer
