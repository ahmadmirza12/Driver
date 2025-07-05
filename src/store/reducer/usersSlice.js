import {createSlice} from '@reduxjs/toolkit';

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    userData: {},
    location: {},
    unseenBadge: {},
    exchnageRate: {},
    selectedCurrency: {
      code: 'LYD',
      title: 'Libyan Dinar',
      _id: 'ل.د',
      rate: 0.00014,
    },
    user_lang: 'en',
  },

  reducers: {
    setUserData(state, action) {
      state.userData = action.payload;
    },
    setLocation(state, action) {
      state.location = action.payload;
    },
    setexchnageRate(state, action) {
      state.exchnageRate = action.payload;
    },
    setselectedCurrency(state, action) {
      state.selectedCurrency = action.payload;
    },
    setUser_lang(state, action) {
      state.user_lang = action.payload;
    },
    setUnseenBadge(state, action) {
      state.unseenBadge = action.payload;
    },
  },
});

export const {
  setUserData,
  setLocation,
  setexchnageRate,
  setselectedCurrency,
  setUser_lang,
  setUnseenBadge,
} = usersSlice.actions;

export default usersSlice.reducer;
