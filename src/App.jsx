import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navigation from "./components/Navigation.jsx";
import ProductLanding from "./components/ProductLanding.jsx";
import ProductsPage from "./components/ProductsPage.jsx";
import AdminPage from "./components/AdminPage.jsx";
import AgeVerification from "./components/AgeVerification.jsx";
import RegisterForm from "./components/auth/RegisterForm.jsx";
import LoginForm from "./components/auth/LoginForm.jsx";
import UserProfile from "./components/user/UserProfile.jsx";
import ForgotPassword from "./components/auth/ForgotPassword.jsx";
import ResetPassword from "./components/auth/ResetPassword.jsx";
import EmailVerification from "./components/auth/EmailVerification.jsx";
import "./App.css";
import DarkModeToggle from "./components/DarkModeToggle";

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  useEffect(() => {
    // Check initial dark mode preference
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navigation 
            cartItems={cartItems} 
            handleUpdateQuantity={handleUpdateQuantity}
            handleRemoveItem={handleRemoveItem}
          />
          <DarkModeToggle />
          <main className="pt-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <AgeVerification />
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProductLanding
                      cartItems={cartItems}
                      setCartItems={setCartItems}
                    />
                  }
                />
                <Route 
                  path="/shop" 
                  element={
                    <ProductsPage 
                      cartItems={cartItems}
                      setCartItems={setCartItems}
                      handleUpdateQuantity={handleUpdateQuantity}
                      handleRemoveItem={handleRemoveItem}
                    />
                  } 
                />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
                <Route
                  path="/verify-email/:token"
                  element={<EmailVerification />}
                />
                <Route path="/verify-email" element={<EmailVerification />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
