import {createSlice} from "@reduxjs/toolkit";
import {User} from "../interfaces";

interface AuthenticationState {
  currentUser: User | null;
}

const initialState: AuthenticationState  = {
  currentUser: null,
}

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setCurrentUser(state, action){
      state.currentUser = action.payload;
    }
  }
})

export const authenticationActions = authenticationSlice.actions;
export default authenticationSlice.reducer;


// const logOutHandler = () => {
//   const auth = getAuth();
//   signOut(auth)
//     .then(() => {
//       navigate("/login")
//     })
//     .catch(error => console.log(error))
// }