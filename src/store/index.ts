import {configureStore} from "@reduxjs/toolkit";
import counterSlice from './counter.ts'
import authenticationSlice from "./authentication.ts";
import eventSlice from "./event.ts";

const store = configureStore({
  reducer: {
    counter: counterSlice,
    authentication: authenticationSlice,
    event: eventSlice
  }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;