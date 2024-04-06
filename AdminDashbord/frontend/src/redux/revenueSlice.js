import { createSlice } from "@reduxjs/toolkit";

const revenueSlice = createSlice({
  name: "revenue",
  initialState: {
    // revenue
    pending: false,
    revenue: null,
    error: false,
    // chart
    chart: [],
  },
  reducers: {
    getChart: (state, action) => {
      state.chart = action.payload;
    },
    getRevenueStart: (state) => {
      state.pending = true;
    },
    getRevenueSucces: (state, action) => {
      state.pending = false;
      state.revenue = action.payload;
      state.error = false;
    },
    getRevenueError: (state) => {
      state.error = true;
      state.pending = false;
    },
  },
});

export const {
  getRevenueStart,
  getRevenueSucces,
  getRevenueError,
  getChart,
} = revenueSlice.actions;

export default revenueSlice.reducer;
