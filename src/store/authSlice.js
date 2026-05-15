import { createSlice } from "@reduxjs/toolkit";

const getStoredUserData = () => {
  try {
    const storedAuth = localStorage.getItem("auth");
    if (!storedAuth) {
      return null;
    }

    const parsedAuth = JSON.parse(storedAuth);
    return parsedAuth?.userData ?? null;
  } catch {
    return null;
  }
};

const initialState = {
  status: !!getStoredUserData(),
  userData: getStoredUserData(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload;
      localStorage.setItem(
        "auth",
        JSON.stringify({ status: true, userData: action.payload }),
      );
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      localStorage.removeItem("auth");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
