import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Nav = () => {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) return <div>Loading...</div>;

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white font-bold text-xl">
          <Link to="/">CrossPoint</Link>
        </div>

        {/* Hamburger Button (mobile only) */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {/* Links */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } absolute md:static top-16 left-0 w-full md:w-auto bg-gray-800 md:flex md:space-x-4 z-10`}
        >
          <div className="flex flex-col md:flex-row md:items-center p-4 md:p-0 space-y-2 md:space-y-0 md:space-x-4">
            <Link to="/" className="text-white hover:text-gray-300">
              Home
            </Link>
            <Link to="/search" className="text-white hover:text-gray-300">
              Search
            </Link>
            {user ? (
              <Link to="/profile" className="text-white hover:text-gray-300">
                Account
                {/* {user.email} */}
              </Link>
            ) : (
              <>
                <Link to="/sign-up" className="text-white hover:text-gray-300">
                  Sign Up
                </Link>
                <Link to="/sign-in" className="text-white hover:text-gray-300">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
