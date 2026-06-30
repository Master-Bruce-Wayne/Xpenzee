import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md flex justify-center space-x-6">
      <Link to="/" className="text-lg font-semibold hover:text-blue-400 ">HOME</Link>
      <Link to="/expense" className="text-lg font-semibold hover:text-blue-400 ">DASHBOARD</Link>
      <Link to="/login" className="text-lg font-semibold hover:text-blue-400 ">LOGIN</Link>
      <Link to="/signup" className="text-lg font-semibold hover:text-blue-400 ">SIGNUP</Link>
    </nav>
  );
}

export default Navbar;

