import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setExpenses, setLoading, setError } from '../redux/expenseSlice.js';
import { toast } from 'react-toastify';
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase.js";

const useFetchExpenses = () => {
    const { user } = useSelector((store) => store.user);
    const { fetchedUpdated } = useSelector((store) => store.expenses);
    const dispatch = useDispatch();
    const uid = user?.uid;

    const fetchExpenses = useCallback(async () => {
        if (!uid) return;
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const expensesRef = collection(db, "users", uid, "expenses");
            const q = query(expensesRef, orderBy("date", "desc"));
            const snap = await getDocs(q);

            const result = snap.docs.map((doc) => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                    // Normalize date: Firestore Timestamp → JS Date → ISO string
                    date: data.date?.toDate?.()
                        ? data.date.toDate().toISOString()
                        : data.date,
                    // Normalize createdAt: Firestore Timestamp → JS Date → ISO string
                    createdAt: data.createdAt?.toDate?.()
                        ? data.createdAt.toDate().toISOString()
                        : null,
                };
            });


            console.log("Result from expenses: ", result);
            dispatch(setExpenses(result));
        } catch (err) {
            console.error("Fetch expenses error:", err);
            dispatch(setError("Failed to load expenses."));
            toast.error("Failed to load expenses.");
        } finally {
            dispatch(setLoading(false));
        }
    }, [uid, dispatch]);

    useEffect(() => {
        if (!fetchedUpdated) {
            fetchExpenses();
            console.log("Expenses fetched from hook!");
        }
    }, [fetchedUpdated, fetchExpenses]);

    return { refresh: fetchExpenses };
};

export default useFetchExpenses;
