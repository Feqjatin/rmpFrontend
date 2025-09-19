import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function NavBar({ count }) {
  const [logined, setLogined] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userName);
  const roles = useSelector((state) => state.user.roles);

  useEffect(() => {
    setLogined(!!user);
  }, [user, count]);

  const handleLogout = () => {
    setLogined(false);
    navigate("/login");
  };

  const getProfileImage = () => {
    if (!user) return "/assets/avatars/A.png";

    const lastChar = user.trim().slice(-1).toUpperCase();
    const isLetter = /^[A-Z]$/.test(lastChar);
    const imageFile = isLetter ? lastChar : "A";

    return `/assets/${imageFile}.png`;
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
       
        <Link to="/" className="text-xl font-bold text-blue-600">
          Roima Recruitment
        </Link>

      
        <div className="flex items-center space-x-4">
          {logined ? (
            <div className="relative flex items-center gap-4">
               
              <img
                src={getProfileImage()}
                alt="profile"
                onClick={() => setOpen((prev) => !prev)}
                className="w-12 h-12 rounded-full cursor-pointer border-2 border-gray-200"
              />

               
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Logout
              </button>

              
              {open && (
                <div className="absolute right-0 top-14 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {roles?.length > 0 ? (
                    roles.map((role) => (
                      <Link
                        key={role}
                        to={`/${role.toLowerCase()}/dashboard`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setOpen(false)}
                      >
                        {role} Dashboard
                      </Link>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-sm text-gray-500">
                      No roles found
                    </p>
                  )}
                </div>
              )}
            </div>
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
