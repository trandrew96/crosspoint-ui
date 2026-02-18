import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { IoGameController } from "react-icons/io5";
import { RiAccountCircleFill } from "react-icons/ri";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { HiChevronDown } from "react-icons/hi";
import NavbarSkeleton from "./skeletons/NavbarSkeleton";

const Navbar = () => {
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Navigate to search page with query parameter
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&pageSize=50`);
    setSearchQuery("");
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsProfileDropdownOpen(false);
      setIsMobileMenuOpen(false);
      navigate("/"); // Redirect to home after sign out
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  if (loading) return <NavbarSkeleton />;

  return (
    <nav className="bg-gray-800/50 p-4 drop-shadow-md fixed top-0 w-full backdrop-blur-md bg-bg/70 z-50">
      <div className="max-w-7xl w-full px-4 md:px-10 mx-auto flex justify-between items-center gap-4">
        {/* Logo */}
        <div className="text-white font-bold text-xl shrink-0">
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
              className="w-full h-10 px-4 pr-10 rounded-full text-sm text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bg-gray-200 w-8 h-8 rounded-full flex justify-center items-center hover:bg-gray-300 transition-colors"
            >
              <FiSearch className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        </form>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <Link
            to="/profile"
            className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
          >
            Backlog
          </Link>
          <Link
            to="/popular"
            className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
          >
            Popular
          </Link>
          {user ? (
            // Desktop Profile Dropdown
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-1 text-white hover:text-gray-300 focus:outline-none"
              >
                <RiAccountCircleFill size={28} />
                <HiChevronDown
                  className={`transition-transform ${isProfileDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-700">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/my-reviews"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  >
                    Your Reviews
                  </Link>
                  <Link
                    to="/playlist-test-page"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  >
                    Playlist Test Page
                  </Link>
                  <Link
                    to="/account"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  >
                    Account Settings
                  </Link>
                  <hr className="my-2 border-gray-700" />
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/signin" className="text-white hover:text-gray-300">
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-gray-800 border-t border-gray-700 shadow-lg">
          <div className="flex flex-col p-4 space-y-3">
            <Link
              to="/search"
              onClick={closeMobileMenu}
              className="text-white hover:text-gray-300 py-2"
            >
              Search
            </Link>
            <Link
              to="/popular"
              onClick={closeMobileMenu}
              className="text-white hover:text-gray-300 py-2"
            >
              Popular
            </Link>

            {user ? (
              <>
                <hr className="border-gray-700" />
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="text-white hover:text-gray-300 py-2"
                >
                  Profile
                </Link>
                <Link
                  to="/account"
                  onClick={closeMobileMenu}
                  className="text-white hover:text-gray-300 py-2"
                >
                  Account Settings
                </Link>
                <Link
                  to="/liked-games"
                  onClick={closeMobileMenu}
                  className="text-white hover:text-gray-300 py-2"
                >
                  Liked Games
                </Link>
                <Link
                  to="/playlist-test-page"
                  onClick={closeMobileMenu}
                  className="text-white hover:text-gray-300 py-2"
                >
                  Playlist Test Page{" "}
                </Link>
                <hr className="border-gray-700" />
                <button
                  onClick={handleSignOut}
                  className="text-left text-red-400 hover:text-red-300 py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                {" "}
                <Link
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="text-white hover:text-gray-300 py-2"
                >
                  Sign Up
                </Link>
                <Link
                  to="/signin"
                  onClick={closeMobileMenu}
                  className="text-white hover:text-gray-300 py-2"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
