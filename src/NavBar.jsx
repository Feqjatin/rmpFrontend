import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const [logined, setLogined] = useState(true);  
  const navigate = useNavigate();

  const handleLogout = () => {
    setLogined(false);
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
         
        <Link to="/" className="text-xl font-bold text-blue-600">
          RPM
        </Link>

         
        <div className="flex items-center space-x-4">
          {logined ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-blue-600 font-medium hover:underline"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
