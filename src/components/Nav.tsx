import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Nav = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          <Link to="/">CrossPoint</Link>
        </div>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          <Link to="/explore" className="text-white hover:text-gray-300">
            Explore
          </Link>
          <Link to="/about" className="text-white hover:text-gray-300">
            About
          </Link>
          {user ? (
            <Link to="/profile" className="text-white hover:text-gray-300">
              {user.email}
            </Link>
          ) : (
            <>
              <Link to="/sign-up" className="text-white hover:text-gray-300">
                Sign Up
              </Link>{" "}
              <Link to="/sign-in" className="text-white hover:text-gray-300">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
