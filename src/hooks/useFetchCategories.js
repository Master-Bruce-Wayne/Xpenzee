import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories, setLoading, setError } from '../redux/categoriesSlice.js';
import { toast } from 'react-toastify';
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase.js";

const useFetchCategories = () => {
    const { user } = useSelector(store => store.user);
    const { categories, fetched } = useSelector(store => store.categories);
    const dispatch = useDispatch();
    const uid = user?.uid;

    const fetchCategories = useCallback(async () => {
        if (!uid) return;
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const q = query(
                collection(db, "users", uid, "categories"),
                orderBy("name", "asc")
            );

            const snap = await getDocs(q);
            const result = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            console.log("Result from categories: ", result);

            dispatch(setCategories(result));
        } catch (err) {
            console.error("Fetch categories error:", err);
            dispatch(setError("Failed to load categories."));
            toast.error("Failed to load categories.");
        } finally {
            dispatch(setLoading(false));
        }
    }, [uid, dispatch]);

    useEffect(() => {
        // if(fetched) return; 
        if(categories.length>0) return; 
        
        fetchCategories();
        console.log("Categories fetched from hook!");
    }, [fetchCategories]);

    return { refresh: fetchCategories };
}

export default useFetchCategories;
