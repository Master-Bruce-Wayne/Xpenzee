import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiHome, FiPlusCircle, FiList, FiTag, FiLogOut } from "react-icons/fi";

import { signOut } from "firebase/auth";
import { auth } from "../firebase.js";
import { toast } from "react-toastify";
import { clearUser } from "../redux/userSlice.js";

const NAV_LINKS = [
  { to: "/",           label: "Dashboard",   icon: FiHome       },
  { to: "/categories", label: "Categories",  icon: FiTag        },
  { to: "/expense/add",label: "Add Expense", icon: FiPlusCircle },
  { to: "/expense",    label: "History",     icon: FiList       },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error during sign-out:", error);
      toast.error("Failed to log out!");
    }
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 text-white flex flex-col p-5 shadow-lg">
      {/* Brand */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white tracking-tight">
          💸 Expense Tracker
        </h2>
        {user?.fullName && (
          <p className="text-xs text-gray-500 mt-1 truncate">{user.email}</p>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_LINKS.map(({ to, label, icon: Icon }) => {
          const isActive =
            to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="text-base shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 hover:text-red-300 transition mt-2"
      >
        <FiLogOut className="text-base shrink-0" />
        Sign Out
      </button>
    </div>
  );
};

export default Sidebar;
