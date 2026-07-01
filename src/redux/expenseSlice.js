import { createSlice } from "@reduxjs/toolkit";

// EXPENSES
const expenseSlice = createSlice({
    name: "expenses",
    initialState: {
        expenses: [],
        fetchedUpdated: false,
        loading: false,
        error: null,
    },
    reducers: {
        setExpenses: (state, action) => {
            state.expenses = action.payload;
            state.fetchedUpdated = true;
        },
        addExpense: (state, action) => {
            state.expenses.push(action.payload);
        },
        removeExpense: (state, action) => {
            state.expenses = state.expenses.filter(exp => exp.id !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
});

export const { setExpenses, addExpense, removeExpense, setLoading, setError } = expenseSlice.actions;
export default expenseSlice.reducer;


