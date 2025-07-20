import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  token: '',
  verificationToken: '',
  isOnBoarding: false,
};
export const authConfigsSlice = createSlice({
  name: 'authConfigs',
  initialState: initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    setOnBoarding(state, action) {
      state.isOnBoarding = action.payload;
    },
    logout(state, action) {
      state.token = '';
      state.verificationToken = '';
    },
    setVerificationToken(state, action) {
      state.verificationToken = action.payload;
    },
  },
});

export const {setToken, setOnBoarding, logout, setVerificationToken} = authConfigsSlice.actions;
