import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";

// Redux
import { setUser, clearUser } from "./redux/userSlice.js";

// Components
import Sidebar from "./components/SideBar";

// Pages
import Expenses from "./pages/Expenses";
import Dashboard from "./pages/Dashboard";
import AddNew from "./pages/AddNew";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";

// ── Protected Route ──────────────────────────────────────────────────────────
// Redirects to /login if user is not authenticated.
function ProtectedRoute({ children }) {
  const { user, authLoading } = useSelector((state) => state.user);

  if (authLoading) return null; // still waiting — let AppLayout handle the spinner
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// ── App Layout ───────────────────────────────────────────────────────────────
function AppLayout() {
  const dispatch = useDispatch();
  const { authLoading } = useSelector((state) => state.user);
  const location = useLocation();
  const authRoutes = ["/login", "/signup"];

  // Subscribe to Firebase auth state once on mount.
  // This runs on every refresh and restores the session from Firebase's
  // own persistence (IndexedDB), so Redux is always in sync.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(
          setUser({
            fullName: firebaseUser.displayName,
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            profileImage: firebaseUser.photoURL,
          })
        );
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe(); // cleanup on unmount
  }, [dispatch]);

  // Full-screen loading spinner while Firebase resolves auth state.
  // Prevents a flash of the login page for already-authenticated users.
  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-sm text-gray-400 tracking-widest uppercase">Loading…</p>
        </div>
      </div>
    );
  }

  // Auth routes render without sidebar
  if (authRoutes.includes(location.pathname)) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    );
  }

  // Protected app routes render with sidebar
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-grow ml-64 h-screen overflow-y-auto">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/expense" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
          <Route path="/expense/add" element={<ProtectedRoute><AddNew /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
