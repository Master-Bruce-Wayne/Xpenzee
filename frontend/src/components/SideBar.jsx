import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { signOut } from "firebase/auth";
import { auth } from "../firebase.js";
import { toast } from "react-toastify";


const Sidebar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  // added fire-base
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Log out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error during sign-out:", error);
      toast.error("Failed to log out!");
    }
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col p-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Expense Tracker</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="hover:bg-gray-700 p-2 rounded">Home</Link>
        <Link to="/expense/add" className="hover:bg-gray-700 p-2 rounded">Add Expense</Link>
        <Link to="/expense" className="hover:bg-gray-700 p-2 rounded">View History</Link>
        <button 
          onClick={handleSignOut} 
          className="hover:bg-gray-700 p-2 rounded text-red-400 text-left"
        >
          Sign Out
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
