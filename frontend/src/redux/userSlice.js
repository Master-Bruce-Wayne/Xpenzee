import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        authLoading: true, // true until onAuthStateChanged resolves
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.authLoading = false;
        },
        clearUser: (state) => {
            state.user = null;
            state.authLoading = false;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;