import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Sidebar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    alert("Sign out successful");
    navigate("/login");
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
