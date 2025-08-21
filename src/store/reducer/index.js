import {combineReducers} from 'redux';

import {authConfigsSlice} from './AuthConfig';
import {usersSlice} from './usersSlice';
import {chatSlice} from './ChatSlice';
import {bookingSlice} from './bookingSlice';
import {dataSlice} from './dataSlice';

export const rootReducer = combineReducers({
  users: usersSlice.reducer,
  authConfig: authConfigsSlice.reducer,
  chat: chatSlice.reducer,
  booking: bookingSlice.reducer,
  data:dataSlice.reducer,
});
