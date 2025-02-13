import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, ShoppingCart, User, ChevronDown, Plus, Minus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";

export default function Navigation({ cartItems = [], handleUpdateQuantity, handleRemoveItem }) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsDropdownOpen(false);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
    <div className="flex items-center py-4">
      <img
        src={item.image || "/api/placeholder/80/80"}
        alt={item.name}
        className="h-20 w-20 rounded object-cover"
      />
      <div className="ml-4 flex-1">
        <h3 className="font-medium text-blue-900 dark:text-blue-100">{item.name}</h3>
        {(item.selectedSize || item.selectedColor) && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {item.selectedSize && `Size: ${item.selectedSize}`}
            {item.selectedSize && item.selectedColor && " | "}
            {item.selectedColor && `Color: ${item.selectedColor}`}
          </p>
        )}
        <p className="text-sm text-blue-600 dark:text-blue-400">${item.price.toFixed(2)}</p>
        <div className="mt-2 flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 dark:border-gray-600 dark:text-gray-200"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="mx-3 dark:text-gray-200">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 dark:border-gray-600 dark:text-gray-200"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="ml-4 dark:text-gray-200 dark:hover:text-white"
        onClick={() => onRemove(item.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white">
              StreamStore
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {/* Main Navigation Items */}
            <Link to="/shop" className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
              Shop
            </Link>
            <Link to="/#featured" className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
              Featured
            </Link>
            <Link to="/#about" className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
              About
            </Link>
            <Link to="/#stream" className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
              Live Stream
            </Link>

            {/* Shopping Cart */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="relative text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
                  <ShoppingCart className="w-6 h-6" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="bg-white dark:bg-gray-800 w-full max-w-md"
              >
                <SheetHeader>
                  <SheetTitle className="text-gray-900 dark:text-white">Shopping Cart</SheetTitle>
                  <SheetDescription className="text-gray-600 dark:text-gray-300">
                    Review and manage your selected items
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8">
                  {cartItems.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">Your cart is empty</p>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemove={handleRemoveItem}
                          />
                        ))}
                      </div>
                      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex justify-between text-lg font-semibold">
                          <span className="text-gray-900 dark:text-white">Total</span>
                          <span className="text-blue-600 dark:text-blue-400">
                            ${calculateTotal().toFixed(2)}
                          </span>
                        </div>
                        <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
                          Checkout
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* User Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
              >
                <User className="w-6 h-6" />
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button and Cart */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Shopping Cart for Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="relative text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
                  <ShoppingCart className="w-6 h-6" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="bg-white dark:bg-gray-800 w-full max-w-md"
              >
                <SheetHeader>
                  <SheetTitle className="text-gray-900 dark:text-white">Shopping Cart</SheetTitle>
                  <SheetDescription className="text-gray-600 dark:text-gray-300">
                    Review and manage your selected items
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8">
                  {cartItems.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">Your cart is empty</p>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemove={handleRemoveItem}
                          />
                        ))}
                      </div>
                      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex justify-between text-lg font-semibold">
                          <span className="text-gray-900 dark:text-white">Total</span>
                          <span className="text-blue-600 dark:text-blue-400">
                            ${calculateTotal().toFixed(2)}
                          </span>
                        </div>
                        <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
                          Checkout
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800">
              <Link
                to="/shop"
                className="block px-3 py-2 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/#featured"
                className="block px-3 py-2 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Featured
              </Link>
              <Link
                to="/#about"
                className="block px-3 py-2 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/#stream"
                className="block px-3 py-2 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Live Stream
              </Link>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
