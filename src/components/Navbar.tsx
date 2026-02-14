import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IoGameController } from "react-icons/io5";
import { RiAccountCircleFill } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";

const Navbar = () => {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Navigate to search page with query parameter
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&pageSize=50`);
    setSearchQuery(""); // Clear search input
  };

  if (loading) return <div>Loading...</div>;

  return (
    <nav className="bg-gray-800/50 p-4 drop-shadow-md fixed top-0 w-full backdrop-blur-md bg-bg/70 z-50">
      <div className="container mx-auto flex justify-between items-center gap-4">
        {/* Logo */}
        <div className="text-white font-bold text-xl flex-shrink-0">
          <Link to="/">
            <div className="flex gap-2 justify-center items-center">
              <IoGameController size={28} className="text-white" />
              <span>CrossPoint</span>
            </div>
          </Link>
        </div>

        {/* Search Bar (Desktop only) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md"
        >
          <div className="relative w-full">
            <input
              type="search"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-4 pr-10 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-amber-50"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bg-slate-200 w-8 h-8 rounded-full flex justify-center items-center hover:bg-slate-300 transition-colors"
            >
              <FiSearch className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </form>

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
          } absolute md:static top-16 left-0 w-full md:w-auto md:flex md:space-x-4 z-10 bg-gray-800 md:bg-transparent`}
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
