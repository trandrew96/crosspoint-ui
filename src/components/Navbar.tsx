import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoGameController } from "react-icons/io5";
import { RiAccountCircleFill } from "react-icons/ri";

const Navbar = () => {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) return <div>Loading...</div>;

  return (
    <nav className="bg-gray-800/50 p-4 drop-shadow-md fixed top-0 w-full backdrop-blur-md bg-bg/70 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white font-bold text-xl">
          <Link to="/">
            <div className="flex gap-2 justify-center items-center">
              <IoGameController size={28} className="text-white" />
              <span>CrossPoint</span>
            </div>
          </Link>
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
          } absolute md:static top-16 left-0 w-full md:w-auto md:flex md:space-x-4 z-10`}
        >
          <div className="flex flex-col md:flex-row md:items-center p-4 md:p-0 space-y-2 md:space-y-0 md:space-x-4">
            <Link to="/" className="text-white hover:text-gray-300">
              Home
            </Link>
            <Link to="/search" className="text-white hover:text-gray-300">
              Search
            </Link>
            <Link to="/explore" className="text-white hover:text-gray-300">
              Explore
            </Link>
            {user ? (
              <Link to="/profile" className="text-white hover:text-gray-300">
                <RiAccountCircleFill size={28} className="text-white" />
                {/* {user.email} */}
              </Link>
            ) : (
              <>
                <Link to="/signup" className="text-white hover:text-gray-300">
                  Sign Up
                </Link>
                <Link to="/signin" className="text-white hover:text-gray-300">
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

export default Navbar;
