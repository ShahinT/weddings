 import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  counter: 1,
  showCounter: true
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state, action){
      state.counter = state.counter + action.payload;
    }
  }
})

 export const counterActions = counterSlice.actions;
 export default counterSlice.reducer;