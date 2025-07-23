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
    setToken: (state, action) => {
      state.token = action.payload;
      console.log('Token stored in Redux:', state.token);
    },
    setOnBoarding: (state, action) => {
      state.isOnBoarding = action.payload;
    },
    logout: (state) => {
      state.token = '';
      state.verificationToken = '';
      console.log('User logged out, tokens cleared');
    },
    setVerificationToken: (state, action) => {
      state.verificationToken = action.payload;
    },
  },
});

// Selector to get the token from the Redux store
export const selectToken = (state) => state.authConfig?.token;

// Export actions
export const {setToken, setOnBoarding, logout, setVerificationToken} = authConfigsSlice.actions;

export default authConfigsSlice.reducer;
