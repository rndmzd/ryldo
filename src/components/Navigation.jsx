import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navigation() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              StreamStore
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              to="/shop"
              className="text-base font-medium text-blue-600 hover:text-blue-900"
            >
              Shop
            </Link>
            <Link
              to="/#featured"
              className="text-base font-medium text-blue-600 hover:text-blue-900"
            >
              Featured
            </Link>
            <Link
              to="/#about"
              className="text-base font-medium text-blue-600 hover:text-blue-900"
            >
              About
            </Link>
            <Link
              to="/#stream"
              className="text-base font-medium text-blue-600 hover:text-blue-900"
            >
              Live Stream
            </Link>

            {/* Auth Links */}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-base font-medium text-blue-600 hover:text-blue-900"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-base font-medium text-blue-600 hover:text-blue-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-base font-medium text-blue-600 hover:text-blue-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-base font-medium text-blue-600 hover:text-blue-900"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-blue-600 hover:text-blue-900 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              Menu
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          {isMenuOpen && (
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/shop"
                className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-900"
              >
                Shop
              </Link>
              <Link
                to="/#featured"
                className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-900"
              >
                Featured
              </Link>
              <Link
                to="/#about"
                className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-900"
              >
                About
              </Link>
              <Link
                to="/#stream"
                className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-900"
              >
                Live Stream
              </Link>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-900"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-900"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
