import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../models/main.model";

export interface userState {
  user: User | {};
}

const initialState: userState = {
  user: {},
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state: userState, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setUserNull: (state: userState) => {
      state.user = {};
    },
  },
});

export const userReducer = userSlice.reducer;
export const { setUser, setUserNull } = userSlice.actions;
