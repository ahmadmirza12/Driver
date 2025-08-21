import {createSlice} from '@reduxjs/toolkit';

export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    user: {},
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});
export const {setUser} = dataSlice.actions;
export default dataSlice.reducer;
