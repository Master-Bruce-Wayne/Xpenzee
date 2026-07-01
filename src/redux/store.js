import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import categoriesSlice from "./categoriesSlice";
import expenseSlice from "./expenseSlice";

export const store = configureStore({
    devTools: true,
    reducer: {
        user: userSlice,
        categories: categoriesSlice,
        expenses: expenseSlice
    },
});

export default store;