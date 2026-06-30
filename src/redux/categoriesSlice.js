import { createSlice } from "@reduxjs/toolkit";

// CATEGORIES 
const categoriesSlice = createSlice({
    name: "categories",
    initialState: {
        categories: [],
        fetchedUpdated: false,
        loading: false,
        error: null,
    },
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
            state.fetchedUpdated = true;
        },
        addCategory: (state, action) => {
            state.categories.push(action.payload);
        },
        removeCategory: (state, action) => {
            state.categories = state.categories.filter(c => c.id !== action.payload);
        },
        updateCategorySpent: (state, action) => {
            const { categoryName, amount } = action.payload;
            const category = state.categories.find(c => c.name === categoryName);
            if (category) {
                category.totalSpent = (category.totalSpent || 0) + amount;
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
});

export const { setCategories, addCategory, removeCategory, updateCategorySpent, setLoading, setError } = categoriesSlice.actions;
export default categoriesSlice.reducer;


