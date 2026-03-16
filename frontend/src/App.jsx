import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
// import "./App.css";

// components
// import Navbar from "./components/Navbar";
import Sidebar from "./components/SideBar";

// pages
import Expenses from "./pages/Expenses";
import Dashboard from "./pages/Dashboard";
import AddNew from "./pages/AddNew";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";


function AppLayout() {
  const location = useLocation();
  const authRoutes = ["/login", "/signup"]; 

  return authRoutes.includes(location.pathname) ? (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  ) : (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
  
      <div className="flex-grow ml-64 h-screen overflow-y-auto ">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expense" element={<Expenses />} />
          <Route path="/expense/add" element={<AddNew />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;

