import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

export const store = configureStore({
    devTools: true,
    reducer: {
        user: userSlice,
    },
});

export default store;